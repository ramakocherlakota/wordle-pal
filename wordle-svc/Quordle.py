import Wordle
from functools import reduce
import sys, json, math

def from_args(args):
    debug=False
    dbname="wordle.sqlite"
    dbfolder="../db"
    targets = None
    guesses = []
    scores_list = None
    hard_mode = False
    
    for arg in args:
        if arg == "--hard":
            hard_mode = True
        elif arg == "--debug":
            debug = True
        elif arg.startswith("--dbname"):
            dbname = arg.split("=")[1]
        elif arg.startswith("--dbfolder"):
            dbfolder = arg.split("=")[1]
        elif arg.startswith("--guess"):
            guesses = arg.split("=")[1].split(",")
        elif arg.startswith("--target"):
            targets = arg.split("=")[1].split(",")
        elif arg.startswith("--score"):
            for scores in arg.split("=")[1].split(";"):
                scores_list.append(scores.split(","))
                
    return Quordle(sqlite_folder=dbfolder, sqlite_dbname=dbname, targets=targets, guesses=guesses, scores_list=[], hard_mode=hard_mode, debug=debug)

class Quordle:

    def __init__(self, 
                 guesses=[],
                 targets=[],
                 scores_list=[[]], 
                 hard_mode=False, 
                 debug=False,
                 sqlite_folder=None,
                 sqlite_dbname=None, 
                 sqlite_bucket=None) :
        self.sqlite_dbname = sqlite_dbname
        self.sqlite_folder = sqlite_folder
        self.sqlite_bucket = sqlite_bucket
        self.common_wordle = Wordle.Wordle(sqlite_folder=sqlite_folder, sqlite_dbname = sqlite_dbname, sqlite_bucket = sqlite_bucket)
        self.hard_mode = hard_mode
        self.debug = debug
        self.targets = targets
        self.guesses = guesses
        if scores_list:
            self.scores_list = scores_list;
        else:
            self.scores_list = list(map(lambda target: self.common_wordle.score_guesses(target, guesses), targets))

        self.wordles = []
        for n in range(len(self.scores_list)):
            target = self.targets[n] if self.targets else None
            scores = self.scores_list[n]
            wordle = Wordle.Wordle(guesses= self.guesses,
                                   target= target,
                                   scores= scores,
                                   hard_mode = False, # hard_mode is handled globally
                                   debug = self.debug,
                                   sqlite_bucket=self.sqlite_bucket,
                                   sqlite_folder=self.sqlite_folder,
                                   sqlite_dbname = self.sqlite_dbname)
            self.wordles.append(wordle)

#    def scores(self, targets, guesses):
#        score_lists = []
#        for t in targets:
#            scores = []
#            for g in guesses:
#                score = self.common_wordle.score_guess(t, g)
#                scores.append(score)
#                if self.common_wordle.solved(score):
#                    break
#            score_lists.append(scores)
#        return score_lists
            
    def rate_solution(self):
        if not self.targets:
            return {"error": "Rating requires targets."}

        target_ratings = {}
        for wordle in self.wordles:
            target_ratings[wordle.target] = wordle.rate_solution()

        totals = []
        for target in self.targets:
            target_rating_list = target_ratings[target]
            for n in range(len(target_rating_list)):
                rating = target_rating_list[n]
                if n >= len(totals):
                    totals.append({"uncertainty_prior" : 0,
                                   "uncertainty_post" : 0,
                                   "luck": 0,
                                   "exp_uncertainty_post" : 0});
                totals[n]["uncertainty_prior"] += rating.get("uncertainty_prior", 0)
                totals[n]["uncertainty_post"] += rating.get("uncertainty_post", 0)
                totals[n]["exp_uncertainty_post"] += rating.get("exp_uncertainty_post", 0)
                totals[n]['luck'] += rating.get("luck", 0)
        for n in range(len(totals)):
            totals[n]['guess'] = self.guesses[n]

        return {
            "by_target": target_ratings,
            "totals" : totals
        }

    def guess(self, count):
        if self.is_solved():
            return None

        all_guesses = self.rate_all_guesses()
        if 'error' in all_guesses:
            return all_guesses;
        if count:
            return all_guesses['uncertainties'][0:count]
        else:
            return all_guesses['uncertainties']

    def rate_all_guesses(self):
        found_guess = None
        still_unsolved = []
        remaining_answers_list = []
        for n in range(len(self.wordles)):
            wordle = self.wordles[n]
            if not wordle.is_solved():
                still_unsolved.append(n)
            remaining_answers = wordle.remaining_answers()
            if len(remaining_answers) == 0:
                return {"error": "There seems to be a problem somewhere - the inputs are inconsistent."}
            if len(remaining_answers) == 1:
                found_guess = remaining_answers[0]
            remaining_answers_list.append(remaining_answers)
        if len(still_unsolved) == 0:
            return {"error": "Already solved!"}
        wordle_expected_uncertainties = []
        for n in range(len(self.wordles)):
            wordle = self.wordles[n]
            remaining_answers = remaining_answers_list[n]
            exp_unc_by_guess = wordle.expected_uncertainty_by_guess(remaining_answers)
            if not type(exp_unc_by_guess) is list:
                exp_unc_by_guess = [exp_unc_by_guess]
            wordle_expected_uncertainties.append(self.list_to_dict_keyed_on(exp_unc_by_guess, 'guess'))
        expected_uncertainties = list(self.merge_by_guess(wordle_expected_uncertainties).values())
        if self.hard_mode:
            expected_uncertainties = list(filter(lambda x : x['compatible'], expected_uncertainties))
        expected_uncertainties.sort(key=lambda x: x['expected_uncertainty_after_guess'])

        # need to re-rank for ties
        rank = 1
        rank_including_ties = 0
        previous_uncertainty = -1
        previous_compatible = -1
        for g in expected_uncertainties:
            rank_including_ties = rank_including_ties + 1
            if previous_uncertainty != g['expected_uncertainty_after_guess'] or previous_compatible != g['compatible'] :
                rank = rank_including_ties
            g['rank'] = rank
            previous_uncertainty = g['expected_uncertainty_after_guess']
        return {
            "uncertainties" : expected_uncertainties,
            "remaining_answers": remaining_answers_list
        }

    def solve(self, targets, start_with=[]):
        guesses = []
        turn = 1
        for t in start_with:
            guesses.append({"guess": t, "turn" : turn})
            turn = turn + 1
        self.wordles = []
        for n in range(len(targets)):
            target = targets[n]
            scores = []
            for guess in start_with:
                score = self.common_wordle.score_guess(target, guess)
                scores.append(score)
            guess_scores = self.create_guess_scores(start_with, scores)
            wordle = Wordle.Wordle(guess_scores=guess_scores, hard_mode = False, debug = self.debug, sqlite_bucket=self.sqlite_bucket, sqlite_folder=self.sqlite_folder, sqlite_dbname = self.sqlite_dbname)
            self.wordles.append(wordle)

        while not self.is_solved():
            next_guess = self.guess()
            guess = next_guess['guess']
            for k in range(len(self.wordles)):
                wordle = self.wordles[k]
                target = targets[k]
                if not wordle.is_solved():
                    score = wordle.score_guess(target, guess)
                    wordle.guess_scores.append([guess, score])
            next_guess['turn'] = turn
            turn = turn + 1
            guesses.append(next_guess)
        return guesses

    def remaining_answers(self): 
        remaining_answers = []
        for n in range(len(self.wordles)):
            wordle = self.wordles[n]
            remaining_answers.append(wordle.remaining_answers());
        return remaining_answers


    def create_guess_scores(self, guesses, scores):
        guess_scores = []
        for n in range(len(guesses)):
            if n < len(scores):
                guess_scores.append([guesses[n], scores[n]])
        return guess_scores

    def is_solved(self):
        for w in self.wordles:
            if not w.is_solved():
                return False
        return True

    # list should be a list of dicts, each with a unique `key` value
    def list_to_dict_keyed_on(self, list, key):
        retval = {}
        for dict in list:
            retval[dict[key]] = dict
        return retval

    # wordle_expected_uncertainties is a list of dicts
    # keys of each dict are guesses, values are next_guess objects
    # return value is a dict keyed on guess
    def merge_by_guess(self, wordle_expected_uncertainties) :
        return reduce(self.merge_all_guesses, wordle_expected_uncertainties)

    def merge_all_guesses(self, dict1, dict2) :
        dict3 = {}
        for key in dict1:
            g1 = dict1[key]
            g2 = dict2[key]
            dict3[key] = self.merge_guesses(g1, g2)
        return dict3

    def merge_guesses(self, g1, g2) :
        if not g1:
            return g2
        if not g2:
            return g1
        g = {}
        g['guess'] = g1['guess']
        g['compatible'] = g1['compatible'] or g2['compatible'] 
        g['uncertainty_before_guess'] = g1['uncertainty_before_guess'] + g2['uncertainty_before_guess']
        g['expected_uncertainty_after_guess'] = g1['expected_uncertainty_after_guess'] + g2['expected_uncertainty_after_guess']
        return g


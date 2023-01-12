import Wordle
from functools import reduce
import sys, json

class Quordle:

    def guess(self):
        guesses = self.guesses(1);
        if guesses and len(guesses) > 0:
            return guesses[0]
        else:
            return None

    def guesses(self, count):
        all_guesses = self.rate_all_guesses()
        return all_guesses['uncertainties'][0:count]

    def rate_solution(self, guesses, targets, count):
        so_far = []
        ratings = []
        for guess in guesses:
            ratings.append(self.rate_guess(so_far, targets, guess, count))
            so_far.append(guess)
        return ratings

    def rate_guess(self, guesses, targets, guess, count):
        score_lists = []
        for t in targets:
            scores = []
            for g in guesses:
                score = self.common_wordle.score_guess(t, g)
                scores.append(score)
            score_lists.append(scores)
        self.set_scores_list(guesses, score_lists);
        all_guesses = self.rate_all_guesses()
        top_guesses = all_guesses['uncertainties'][0:count]
        remaining_answer_lists = all_guesses['remaining_answers']
        guess_records = list(filter(lambda x: x['guess'] == guess, all_guesses['uncertainties']))
        if len(guess_records) == 1:
            guess_record = guess_records[0]
            rank = guess_record['rank']
            guess_info = guess_record['uncertainty_before_guess'] - guess_record['expected_uncertainty_after_guess'] 
            best_info = top_guesses[0]['uncertainty_before_guess'] - top_guesses[0]['expected_uncertainty_after_guess'] 
            info_ratio = guess_info / best_info if (best_info > 0 or guess_info > 0) else 1
            compatible_targets_iter = map(lambda c, t: (guess in c) and t,
                                          remaining_answer_lists,
                                          targets)
            compatible_targets = list(filter(None, compatible_targets_iter))
            return {
                "scores" : score_lists,
                "info_ratio": info_ratio,
                "guess_record" : guess_record,
                "top_guesses" : top_guesses,
                "solves_a_quordle" : guess in targets,
                "is_compatible_with" : compatible_targets,
                "remaining_answer_counts": list(map(len, remaining_answer_lists))
            }
        else:
            return None

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
        for n in range(len(still_unsolved)):
            wordle = self.wordles[still_unsolved[n]]
            remaining_answers = remaining_answers_list[n]
            exp_unc_by_guess = wordle.expected_uncertainty_by_guess(remaining_answers, found_guess)
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
            if not wordle.is_solved():
                remaining_answers.append(wordle.remaining_answers());
        return remaining_answers

    def __init__(self, guesses=[], scores_list=[[]], hard_mode=False, debug=False,
                 sqlite_folder=None,
                 sqlite_dbname=None, 
                 sqlite_bucket=None) :
        self.sqlite_dbname = sqlite_dbname
        self.sqlite_folder = sqlite_folder
        self.sqlite_bucket = sqlite_bucket
        self.common_wordle = Wordle.Wordle(sqlite_folder=sqlite_folder, sqlite_dbname = sqlite_dbname, sqlite_bucket = sqlite_bucket)
        self.hard_mode = hard_mode
        self.debug = debug
        self.set_scores_list(guesses, scores_list);

    def set_scores_list(self, guesses, scores_list):
        self.wordles = []
        for scores in scores_list:
            guess_scores = self.create_guess_scores(guesses, scores)
            self.wordles.append(Wordle.Wordle(guess_scores=guess_scores, hard_mode = False, debug = self.debug, sqlite_dbname=self.sqlite_dbname, sqlite_folder=self.sqlite_folder, sqlite_bucket=self.sqlite_bucket))

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


import Wordle
from functools import reduce
import sys, json, math

class Sequence:

    # initialization code
    def __init__(self, guesses=[], scores_list=[[]], hard_mode=False, debug=False,
                 targets=None,
                 sqlite_folder=None,
                 sqlite_dbname=None, 
                 sqlite_bucket=None) :
        self.guesses = guesses
        self.targets = targets
        self.hard_mode = hard_mode
        self.debug = debug
        self.sqlite_dbname = sqlite_dbname
        self.sqlite_folder = sqlite_folder
        self.sqlite_bucket = sqlite_bucket

        self.common_wordle = Wordle.Wordle(guess_scores=[], hard_mode = False, debug = self.debug, sqlite_bucket=self.sqlite_bucket, sqlite_folder=self.sqlite_folder, sqlite_dbname = self.sqlite_dbname)  

        if targets:
            self.scores_list = self.scores_from_targets(guesses, targets)
        else:
            self.score_lists = score_lists
        self.wordles = []
        for n in range(len(self.scores_list)):
            scores = self.scores_list[n]
            target = targets[n] if targets else None
            guess_scores = self.create_guess_scores(self.guesses, scores)
            self.wordles.append(Wordle.Wordle(guess_scores=guess_scores, target=target, hard_mode = self.hard_mode, debug = self.debug, sqlite_bucket=self.sqlite_bucket, sqlite_folder=self.sqlite_folder, sqlite_dbname = self.sqlite_dbname))

    def create_guess_scores(self, guesses, scores):
        guess_scores = []
        for n in range(len(guesses)):
            if n < len(scores):
                guess_scores.append([guesses[n], scores[n]])
        return guess_scores

    def scores_from_targets(self, guesses, targets):
        scores_list = []
        for target in targets:
            scores = self.common_wordle.score_guesses(target, guesses)
            scores_list.append(scores)
        return scores_list

    def current_wordle(self):
        for wordle in self.wordles:
            if not wordle.is_solved():
                return wordle
        return None

    def is_solved(self):
        return not self.current_wordle()

    # api

    def rate_solution(self):
        if not self.targets:
            return {"error": "Rating requires targets."}

        target_ratings = {}
        for wordle in self.wordles:
            target_ratings[target] = wordle.rate_solution()
        return {
            "by_target": target_ratings
        }

    def remaining_answers(self):
        current = self.current_wordle()
        if not current:
            return []
        else:
            return current.remaining_answers()

    def guess(self):
        return self.guesses(1)

    def guesses(self, count):
        return self.current_wordle().guesses(count)

    def solve(self):
        if not self.targets:
            return {"error": "Solve requires targets."}
        
        guesses = []
        turn = 1

        for guess in self.guesses:
            guesses.append({"guess": guess, "turn" : turn})
            turn = turn + 1

        guess_scores = self.create_guess_scores(start_with, score_lists)
        self.guess_scores = guess_scores

        while not self.is_solved():
            next_guess = self.guess()
            next_guess['turn'] = turn
            turn = turn + 1
            guesses.append(next_guess)

            self.guesses.append(next_guess.guess)
#             for n in range(len(self.targets)):
#                 score = 
#             self.score_lists.append(
            

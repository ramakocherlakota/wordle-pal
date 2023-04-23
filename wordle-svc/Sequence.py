import Wordle
from functools import reduce
import sys, json, math

class Sequence:

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
        if targets:
            self.scores_list = self.scores_from_targets(guesses, targets)
        else:
            self.score_lists = score_lists

    def scores_from_targets(self, guesses, targets):
        wordle = Wordle.Wordle(guess_scores=[], hard_mode = False, debug = self.debug, sqlite_bucket=self.sqlite_bucket, sqlite_folder=self.sqlite_folder, sqlite_dbname = self.sqlite_dbname)        
        scores_list = []
        for target in targets:
            scores = wordle.score_guesses(target, guesses)
            scores_list.append(scores)
        return scores_list

    def rate_solution(self, guesses):
        target_ratings = {}
        for target in targets:
            wordle = Wordle.Wordle(guess_scores=[], hard_mode = False, debug = self.debug, sqlite_bucket=self.sqlite_bucket, sqlite_folder=self.sqlite_folder, sqlite_dbname = self.sqlite_dbname)
            target_ratings[target] = wordle.rate_solution(target, guesses)
        return {
            "by_target": target_ratings
        }

    def create_guess_scores(self, guesses, scores):
        guess_scores = []
        for n in range(len(guesses)):
            if n < len(scores):
                guess_scores.append([guesses[n], scores[n]])
        return guess_scores

    def current_wordle(self):
        for scores in self.scores_list:
            guess_scores = self.create_guess_scores(self.guesses, scores)
            wordle = Wordle.Wordle(guess_scores=guess_scores, hard_mode = self.hard_mode, debug = self.debug, sqlite_bucket=self.sqlite_bucket, sqlite_folder=self.sqlite_folder, sqlite_dbname = self.sqlite_dbname)
            if not wordle.is_solved():
                return wordle
        return None

    def is_solved(self):
        return not self.current_wordle()

    def remaining_answers(self):
        current = self.current_wordle()
        if not current:
            return []
        else:
            return current.remaining_answers()

    def guesses(self, count):
        return self.current_wordle().guesses(count)

    def solve(self, targets, start_with=[]):
        guesses = []
        scores_list = []
        turn = 1

        wordle = Wordle.Wordle(sqlite_folder=self.sqlite_folder, sqlite_dbname = self.sqlite_dbname, sqlite_bucket = self.sqlite_bucket, debug=self.debug, hard_mode=self.hard_mode)
        
        for guess in start_with:
            guesses.append({"guess": guess, "turn" : turn})
            turn = turn + 1

        for n in range(len(targets)):
            target = targets[n]
            scores = []
            for guess in start_with:
                score = wordle.score_guess(target, guess)
                scores.append(score)
            scores_list.append(scores)

        guess_scores = self.create_guess_scores(start_with, score_lists)
        self.guess_scores = guess_scores

        while not self.is_solved():
            next_guess = self.guess()
            guess = next_guess['guess']
            

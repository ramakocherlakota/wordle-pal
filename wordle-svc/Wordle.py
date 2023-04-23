import math
from contextlib import closing
import sqlite3, re, os, sys
from datetime import datetime
import boto3

def from_args(args):
    guess_scores = []
    debug=False
    dbname="wordle.sqlite"
    dbfolder="../db"
    target = None
    guesses = []
    hard_mode = False
    
    for arg in args:
        if arg.startswith("-"):
            if arg == "--debug":
                debug = True
            if arg.startswith("--hard"):
                hard_mode = True
            elif arg.startswith("--dbname"):
                dbname = arg.split("=")[1]
            elif arg.startswith("--dbfolder"):
                dbfolder = arg.split("=")[1]
            elif arg.startswith("--target"):
                target = arg.split("=")[1]
            elif arg.startswith("--guess"):
                guess_scores_str = arg.split("=")[1]
                guess_score_pairs = guess_scores_str.split(",")
                guess_scores = list(map(lambda gsp: gsp.split(":"), guess_score_pairs))
                guesses = list(map(lambda gs: gs[0], guess_scores))
                
    return Wordle(sqlite_folder=dbfolder, sqlite_dbname=dbname, guess_scores = guess_scores, debug=debug, hard_mode=hard_mode, target=target, guesses=guesses)

class Wordle :

    # init and util functions
    def __init__(self, guess_scores=[], hard_mode=False, debug=False,
                 target=None,
                 guesses=[],
                 sqlite_bucket=None,
                 sqlite_folder=None,
                 sqlite_dbname=None) :
        self.sqlite_dbname = sqlite_dbname
        self.sqlite_folder = sqlite_folder
        self.sqlite_bucket = sqlite_bucket
        self.guess_scores = guess_scores
        self.hard_mode = hard_mode
        self.debug = debug
        self.target = target
        if target:
            scores = self.score_guesses(target, guesses)
            self.guess_scores = list(zip(guesses, scores))


    def connect(self):
        connect_to = f"{self.sqlite_folder}/{self.sqlite_dbname}"
        if self.sqlite_bucket:
            if not os.path.exists(connect_to):
                client = boto3.client('s3')
                print(f"{datetime.now()}: downloading {self.sqlite_dbname} from S3", file=sys.stderr)
                client.download_file(self.sqlite_bucket, 
                                     self.sqlite_dbname,
                                     connect_to)
                print(f"{datetime.now()}: download complete", file=sys.stderr)
        if not os.path.exists(connect_to):
            raise Exception(f"Unable to open database because path {connect_to} does not exist!")
        connection = sqlite3.connect(connect_to)
        return connection

    def query(self, sql, title=None):
        with closing(self.connect()) as connection:
            cursor = connection.cursor()
            if self.debug and title is not None:
                print(f">> {title}: {sql}")
            cursor.execute(sql)
            return cursor.fetchall()

    def score_guess(self, target, guess):
        rows = self.query(f"select score from scores where guess = '{guess}' and answer = '{target}'", "score_guess")
        for row in rows:
            return row[0].lower()
        raise Exception(f"Inconsistent data in score_guess (guess={guess} answer={target})")

    def score_guesses(self, target, guesses):
        scores = []
        for guess in guesses:
            scores.append(self.score_guess(target, guess))
        return scores

    def unpack(self, list_of_lists) :
        return list(map(lambda y : y[0], list_of_lists))        

    def list_all_guesses(self) :
        return self.unpack(self.query("select guess from guesses order by 1"))

    def list_all_answers(self) :
        return self.unpack(self.query("select answer from answers order by 1"))

    def list_all_scores(self) :
        return self.unpack(self.query("select distinct score from scores order by 1"))

    def first(self, n):
         return Wordle(guess_scores = self.guess_scores[0:n],
                       target = self.target,
                       hard_mode = self.hard_mode,
                       debug = self.debug,
                       sqlite_dbname = self.sqlite_dbname,
                       sqlite_folder = self.sqlite_folder,
                       sqlite_bucket = self.sqlite_bucket)

#     def scores(self, target, guesses):
#         scores = []
#         current = self
#         for guess in guesses:
#             if not current.is_solved():
#                 score = self.score_guess(target, guess)
#                 scores.append([guess, score])
#                 current = current.extend(guess, score)
#         return scores        


    # wordle api functions

    def rate_solution(self) :
        if not self.target:
            return {"error": "Rating requires a target."}

        ratings = []

        for n in range(len(self.guess_scores)):
            current = self.first(n)
            next = self.first(n+1)
            guess_score = self.guess_scores[n]
            if guess and not current.is_solved:
                ratings.append(self.rate_guess(current, next, guess_score))

        return ratings

    def rate_guess(self, prior, post, guess_score) :
        target = self.target
        [guess, score] = guess_score
        remaining_answers_prior = prior.remaining_answers()
        if len(remaining_answers_prior) == 0:
            return {"error": "There seems to be a problem somewhere - the inputs are inconsistent."}
        uncertainty_prior = math.log(len(remaining_answers_prior), 2)
        exp_uncertainty_post = self.expected_uncertainty_by_guess(remaining_answers_prior, guess)[0]["expected_uncertainty_after_guess"]
        remaining_answers_post = post.remaining_answers()
        if len(remaining_answers_post) == 0:
            return {"error": "There seems to be a problem somewhere - the inputs are inconsistent."}
        uncertainty_post = math.log(len(remaining_answers_post), 2)
        solved = post.is_solved()
        luck = uncertainty_prior if solved else exp_uncertainty_post - uncertainty_post
        return {
            "guess": guess,
            "score": score,
            "remaining_answers_prior": len(remaining_answers_prior),
            "uncertainty_prior": uncertainty_prior,
            "remaining_answers_post": len(remaining_answers_post),
            "uncertainty_post": uncertainty_post,
            "luck" : luck,
            "exp_uncertainty_post": exp_uncertainty_post
        }

#    def rate_all_guesses(self) :
#        if self.is_solved():
#            return None
#        remaining_answers = self.remaining_answers()
#        if len(remaining_answers) == 0:
#            return {"error": "There seems to be a problem somewhere - the inputs are inconsistent."}
#        exp_by_guess = self.expected_uncertainty_by_guess(remaining_answers)
#        info_map = {}
#        compatible = []
#        for g in exp_by_guess :
#            info_map[g['guess']] = g["expected_uncertainty_after_guess"]
#            if g['compatible'] :
#                compatible.append(g['guess'])
#        return {
#            "info_map" : info_map,
#            "compatible" : compatible
#        }
#
#
#    def rate_all_guesses_info(self) :
#        if self.is_solved():
#            return None
#        remaining_answers = self.remaining_answers()
#        if len(remaining_answers) == 0:
#            return {"error": "There seems to be a problem somewhere - the inputs are inconsistent."}
#        exp_by_guess = self.expected_uncertainty_by_guess(remaining_answers)
#        prior_unc = exp_by_guess[0]['uncertainty_before_guess']
#        info_map = {}
#        min_exp_unc = prior_unc
#        compatible = []
#        for g in exp_by_guess :
#            info_map[g['guess']] = prior_unc - g["expected_uncertainty_after_guess"]
#            if g['compatible'] :
#                compatible.append(g['guess'])
#            if g["expected_uncertainty_after_guess"] < min_exp_unc:
#                min_exp_unc = g["expected_uncertainty_after_guess"]
#        max_exp_info = prior_unc - min_exp_unc
#        for h in info_map:
#            info_map[h] = info_map[h] / max_exp_info
#        return {
#            "info_map" : info_map,
#            "compatible" : compatible
#        }

    def guess(self):
        guesses = self.guesses(1);
        if guesses and len(guesses) > 0:
            return guesses[0]
        else:
            return None

    def guesses(self, n) :
        if self.is_solved():
            return None
        remaining_answers = self.remaining_answers()
        if len(remaining_answers) == 0:
            return {"error": "There seems to be a problem somewhere - the inputs are inconsistent."}
        answer_count = len(remaining_answers)
        if answer_count <= 2:
            return list(map(lambda a: {
                'guess': a,
                'expected_uncertainty_after_guess': 0,
                'compatible' : 1,
                'uncertainty_before_guess' : math.log(answer_count, 2)
            }, remaining_answers))
        else:
            next_guesses = self.expected_uncertainty_by_guess(remaining_answers)
            if n:
                return next_guesses[0:n]
            else:
                return next_guesses

    def solve(self, target, start_with=[]) :
        guesses = []
        turn = 1
        for guess in start_with:
            score = self.score_guess(target, guess)
            self.guess_scores.append([guess, score])
            guesses.append({'guess' : guess,
                            'score' : score,
                            'turn' : turn})
            turn = turn + 1
        while not self.is_solved():
            next_guess = self.guess()
            guess = next_guess['guess']
            score = self.score_guess(target, guess)
            self.guess_scores.append([guess, score])
            next_guess['score'] = score
            next_guess['turn'] = turn
            turn = turn + 1
            guesses.append(next_guess)
        return guesses            


#     def extend(self, guess, score):
#         new_guess_scores = self.guess_scores.copy()
#         new_guess_scores.extend([[guess, score]])
#         return Wordle(new_guess_scores, self.hard_mode, self.debug, self.sqlite_bucket,
#                       self.sqlite_folder, self.sqlite_dbname)


    def is_solved(self):
        for [guess, score] in self.guess_scores:
            if self.solved(score):
                return True
        return False

    def solved(self, score):
        return re.match("^B+$", score.upper())

    def remaining_answers(self):
        remaining_answers = []
        froms = ["answers as a"]
        where_clauses = []
        where_clause = ""
        n = 0
        for [guess, score] in self.guess_scores:
            if len(score) > 0:
                table = f"scores_{n}"
                froms.append(f"scores as {table}")
                where_clauses.append(f"a.answer = {table}.answer")
                where_clauses.append(f"'{guess.lower()}' = {table}.guess")
                where_clauses.append(f"'{score.upper()}' = {table}.score")
                n = n + 1
        if n > 0:
            where_clause = f" where " + " and ".join(where_clauses)
        from_clause = ", ".join(froms)
        sql = f"select a.answer from {from_clause} {where_clause}"
        return list(map(lambda x : x[0], self.query(sql, "remaining_answers")))

    def expected_uncertainty_by_guess(self, remaining_answers, for_guess=None) :
        answer_count = len(remaining_answers)
        answers_clause = ",".join(list(map(lambda x : f"'{x}'", remaining_answers)))
        guess_clause = ""
        if for_guess:
            guess_clause = f"AND guess='{for_guess}'"
        subsql = f"select guess, score, count(*) as c from scores where answer in ({answers_clause}) {guess_clause} group by 1, 2"
        hard_mode_clause = ""
        if self.hard_mode:
            hard_mode_clause = f"and guess in ({answers_clause}) "
        sql = f"select guess, sum(c * log2n) / sum(c) as h, guess in ({answers_clause}) as compatible from ({subsql}) as t1, log2_lookup where log2_lookup.n = c {hard_mode_clause} group by 1 order by 2, 3 desc"
        uncertainty_by_guess = []
        rank = 1
        rank_including_ties = 0
        previous_uncertainty = -1
        previous_compatible = -1
        for [guess, uncertainty, compatible] in self.query(sql, "expected_uncertainty_by_guess"):
            rank_including_ties = rank_including_ties + 1
            if previous_uncertainty != uncertainty or previous_compatible != compatible:
                rank = rank_including_ties
                # otherwise it's a tie so just keep the same rank
            previous_uncertainty = uncertainty
            previous_compatible = compatible

            g = {
                "guess": guess,
                "expected_uncertainty_after_guess": uncertainty,
                "compatible": compatible,
                "rank": rank,
                "uncertainty_before_guess" : math.log(answer_count, 2)
            }
            uncertainty_by_guess.append(g)
        return uncertainty_by_guess

    def random_answer(self):
        return self.query("select answer from answers order by random() limit 1")[0][0]


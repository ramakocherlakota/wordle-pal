import math
from contextlib import closing
import sqlite3, re, os, sys
from datetime import datetime
import boto3

def from_args(args):
    debug=False
    dbname="wordle.sqlite"
    dbfolder="../db"
    target = None
    guesses = []
    scores = []
    hard_mode = False
    
    for arg in args:
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
            guess_str = arg.split("=")[1]
            guesses = guess_str.split(",")
        elif arg.startswith("--score"):
            score_str = arg.split("=")[1]
            scores = score_str.split(",")
                
    return Wordle(sqlite_folder=dbfolder, sqlite_dbname=dbname, scores = scores, debug=debug, hard_mode=hard_mode, target=target, guesses=guesses)


class Wordle :
    # init and util functions
    def __init__(self,
                 hard_mode=False,
                 debug=False,
                 target=None,
                 guesses=[],
                 scores=None,
                 sqlite_bucket=None,
                 sqlite_folder=None,
                 sqlite_dbname=None) :
        self.sqlite_dbname = sqlite_dbname
        self.sqlite_folder = sqlite_folder
        self.sqlite_bucket = sqlite_bucket
        self.hard_mode = hard_mode
        self.debug = debug
        self.target = target
        self.guesses = guesses
        if scores:
            self.scores = scores
        else:
            self.scores = self.score_guesses(target, guesses)

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
         return Wordle(guesses = self.guesses[0:n],
                       scores = self.scores[0:n],
                       target = self.target,
                       hard_mode = self.hard_mode,
                       debug = self.debug,
                       sqlite_dbname = self.sqlite_dbname,
                       sqlite_folder = self.sqlite_folder,
                       sqlite_bucket = self.sqlite_bucket)

    # wordle api functions

    def rate_solution(self) :
        if not self.target:
            return {"error": "Rating requires a target."}

        ratings = []

        for n in range(len(self.scores)):
            current = self.first(n)
            guess = self.guesses[n]
            score = self.scores[n]
            if not current.is_solved():
                next = self.first(n+1)
                ratings.append(self.rate_guess(current, next, guess, score))

        return ratings

    def rate_guess(self, prior, post, guess, score) :
        target = self.target
        remaining_answers_prior = prior.remaining_answers()
        remaining_answers_post = post.remaining_answers()

        if len(remaining_answers_post) == 0:
            return {"error": "There seems to be a problem somewhere - the inputs are inconsistent."}

        if len(remaining_answers_prior) == 0:
            return {"error": "There seems to be a problem somewhere - the inputs are inconsistent."}
        uncertainty_prior = math.log(len(remaining_answers_prior), 2)
        exp_uncertainty_post = self.expected_uncertainty_by_guess(remaining_answers_prior, guess)[0]["expected_uncertainty_after_guess"]
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

    def guess(self, n) :
        if self.is_solved():
            return None
        remaining_answers = self.remaining_answers()
        if len(remaining_answers) == 0:
            return {"error": "There seems to be a problem somewhere - the inputs are inconsistent."}
        answer_count = len(remaining_answers)
        next_guesses = self.expected_uncertainty_by_guess(remaining_answers)
        if n:
            return next_guesses[0:n]
        else:
            return next_guesses

    def solve(self) :
        if not self.target:
            return {"error": "Solve requires a target."}

        turns = []
        turn = 1
        for k in range(len(self.scores)):
            score = self.scores[k]
            guess = self.guesses[k]
            turns.append({'guess' : guess,
                          'score' : score,
                          'turn' : turn})
            turn = turn + 1

        while not self.is_solved():
            next_guess = self.guess(1)[0]
            guess = next_guess['guess']
            score = self.score_guess(self.target, guess)
            self.guesses.append(guess)
            self.scores.append(score)
            next_guess['score'] = score
            next_guess['turn'] = turn
            turn = turn + 1
            turns.append(next_guess)
        return turns


    def remaining_answers(self):
        remaining_answers = []
        froms = ["answers as a"]
        where_clauses = []
        where_clause = ""
        n = 0

        for k in range(len(self.guesses)):
            score = self.scores[k]
            guess = self.guesses[k]
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

    def is_solved(self):
        for score in self.scores:
            if self.solved(score):
                return True
        return False

    def solved(self, score):
        return re.match("^B+$", score.upper())

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


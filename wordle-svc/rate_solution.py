import Wordle
import sys, json


wordle = Wordle.Wordle(sqlite_folder=dbfolder, sqlite_dbname = dbname, guess_scores = [], hard_mode=hard_mode, debug=debug)

print(json.dumps(wordle.rate_solution(guesses[-1], guesses)))

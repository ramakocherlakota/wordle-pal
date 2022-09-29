import Wordle
import sys
import json

guess_scores = []
debug=False
dbname="wordle.sqlite"
dbfolder="../db"

for arg in sys.argv[1:]:
    if arg.startswith("-"):
        if arg == "--debug":
            debug = True
        elif arg.startswith("--dbname"):
            dbname = arg.split("=")[1]
        elif arg.startswith("--dbfolder"):
            dbfolder = arg.split("=")[1]
        else:
            raise Exception(f"Unrecognized flag {arg}")
    elif "=" in arg:
        guess_scores.append(arg.split("="))
    else:
        raise Exception(f"Unrecognized argument {arg}")

wordle = Wordle.Wordle(sqlite_folder=dbfolder, sqlite_dbname=dbname, guess_scores = guess_scores, debug=debug)

remaining_answers = wordle.remaining_answers()
print(json.dumps(remaining_answers))


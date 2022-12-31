import Wordle
import sys, json

guess_scores = []
hard_mode = False
debug = False
dbname = "wordle.sqlite"
dbfolder = "../db"
count = 1

for arg in sys.argv[1:]:
    if arg.startswith("-"):
        if arg == "--hard":
            hard_mode = True
        elif arg == "--debug":
            debug = True
        elif arg.startswith("--dbname"):
            dbname = arg.split("=")[1]
        elif arg.startswith("--count"):
            count = int(arg.split("=")[1])
        elif arg.startswith("--dbfolder"):
            dbfolder = arg.split("=")[1]
        else:
            raise Exception(f"Unrecognized flag {arg}")
    elif "=" in arg:
        guess_scores.append(arg.split("="))
    else:
        raise Exception(f"Unrecognized argument {arg}")

wordle = Wordle.Wordle(sqlite_folder=dbfolder, sqlite_dbname = dbname, guess_scores = guess_scores, hard_mode=hard_mode, debug=debug)

print(json.dumps(wordle.guesses(count)))

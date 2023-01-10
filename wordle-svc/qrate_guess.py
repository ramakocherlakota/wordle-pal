import Quordle
import sys, json

hard_mode = False
debug = False
dbname = "wordle.sqlite"
dbfolder = "../db"
count = 1
guesses = []
targets = []

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
        elif arg.startswith("--guesses"):
            guesses = arg.split("=")[1].split(",")
        elif arg.startswith("--targets"):
            targets = arg.split("=")[1].split(",")
        else:
            raise Exception(f"Unrecognized flag {arg}")
    else:
        guess = arg

quordle = Quordle.Quordle(sqlite_folder=dbfolder, sqlite_dbname=dbname, guesses=guesses, hard_mode=hard_mode, debug=debug)

print(json.dumps(quordle.rate_guess(guesses, targets, guess, count)))

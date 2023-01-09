import Quordle
import sys, json

scores_list = []
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
        elif arg.startswith("--guess"):
            guesses = arg.split("=")[1].split(",")
        elif arg.startswith("--score"):
            for scores in arg.split("=")[1].split(";"):
                scores_list.append(scores.split(","))
        else:
            raise Exception(f"Unrecognized flag {arg}")
    else:
        raise Exception(f"Unrecognized arg {arg}")

quordle = Quordle.Quordle(sqlite_folder=dbfolder, sqlite_dbname=dbname, guesses=guesses, scores_list=scores_list, hard_mode=hard_mode, debug=debug)

print(json.dumps(quordle.rate_all_guesses()))

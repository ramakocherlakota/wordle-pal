import Quordle
import sys, json

hard_mode = False
debug = False
targets = []
start_with = []
dbname = "wordle.sqlite"
dbfolder = "../db"

for arg in sys.argv[1:]:
    if arg.startswith("-"):
        if arg == "--hard":
            hard_mode = True
        elif arg == "--debug":
            debug = True
        elif arg.startswith("--start"):
            start_with=arg.split("=")[1].split(",")
        elif arg.startswith("--dbname"):
            dbname = arg.split("=")[1]
        elif arg.startswith("--dbfolder"):
            dbfolder = arg.split("=")[1]
        else:
            raise Exception(f"Unrecognized flag {arg}")
    else:
        targets.append(arg)

quordle = Quordle.Quordle(sqlite_folder=dbfolder, sqlite_dbname = dbname, hard_mode=hard_mode, debug=debug)

print(json.dumps(quordle.solve(targets, start_with=start_with)))

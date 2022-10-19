import Wordle
import sys, json

start_with = []
hard_mode = False
debug = False
target = None
dbname = "wordle.sqlite"
dbfolder = "../db"

for arg in sys.argv[1:]:
    if arg.startswith("-"):
        if arg == "--hard":
            hard_mode = True
        elif arg == "--debug":
            debug = True
        elif arg.startswith("--start"):
            start_with = arg.split("=")[1].split(",")
        elif arg.startswith("--dbname"):
            dbname = arg.split("=")[1]
        elif arg.startswith("--dbfolder"):
            dbfolder = arg.split("=")[1]
        else:
            raise Exception(f"Unrecognized flag {arg}")
    else:
        target = arg

if not target:
    print("You must specify a target word!")
    sys.exit(1)

wordle = Wordle.Wordle(sqlite_folder=dbfolder, sqlite_dbname = dbname, hard_mode=hard_mode, debug=debug)

print(json.dumps(wordle.solve(target, start_with=start_with)))

import Sequence
import sys, json

hard_mode = False
debug = False
dbname = "wordle.sqlite"
dbfolder = "../db"
count = 1
guesses = []
targets = None

for arg in sys.argv[1:]:
    if arg.startswith("-"):
        if arg == "--hard":
            hard_mode = True
        elif arg == "--debug":
            debug = True
        elif arg.startswith("--target"):
            targets = arg.split("=")[1].split(",")
        elif arg.startswith("--dbname"):
            dbname = arg.split("=")[1]
        elif arg.startswith("--dbfolder"):
            dbfolder = arg.split("=")[1]
        elif arg.startswith("--guess"):
            guesses = arg.split("=")[1].split(",")
        elif arg.startswith("--target"):
            targets = arg.split("=")[1].split(",")
        else: 
            raise Exception(f"Unrecognized flag {arg}")
    else:
        raise Exception(f"Unrecognized arg {arg}")

sequence = Sequence.Sequence(sqlite_folder=dbfolder, sqlite_dbname=dbname, guesses=guesses, scores_list=[], hard_mode=hard_mode, debug=debug, targets=targets)

print(json.dumps(sequence.rate_solution()))

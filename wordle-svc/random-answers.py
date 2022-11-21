import sys
import Wordle

dbname = "wordle.sqlite"
dbfolder = "../db"

n = int(sys.argv[1])
while n > 0:
    wordle = Wordle.Wordle(sqlite_folder=dbfolder, sqlite_dbname = dbname)
    target = wordle.random_answer()
    print(f"echo {target}\npython solve.py {target} | jq .")
    n = n - 1

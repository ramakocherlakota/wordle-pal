import Wordle
import sys, json

wordle = Wordle.from_args(sys.argv[1:])

print(json.dumps(wordle.solve()))

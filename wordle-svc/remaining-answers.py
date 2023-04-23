import Wordle
import sys
import json

wordle = Wordle.from_args(sys.argv[1:]);

remaining_answers = wordle.remaining_answers()
print(json.dumps(remaining_answers))


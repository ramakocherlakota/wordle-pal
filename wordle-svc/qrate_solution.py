import Quordle
import sys, json

quordle = Quordle.from_args(sys.argv[1:]);

print(json.dumps(quordle.rate_solution()))

import Quordle
import sys, json

count = None
for arg in sys.argv[1:]:
    if arg.startswith("--count"):
        count = int(arg.split("=")[1])

quordle = Quordle.from_args(sys.argv[1:]);

print(json.dumps(quordle.guess(count)))

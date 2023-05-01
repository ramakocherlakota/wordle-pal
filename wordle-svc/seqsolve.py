import Sequence
import sys, json

sequence = Sequence.from_args(sys.argv[1:]);

print(json.dumps(sequence.solve()))

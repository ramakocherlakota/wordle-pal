import Wordle

def from_args(args):
    debug=False
    dbname="wordle.sqlite"
    dbfolder="../db"
    targets = None
    guesses = []
    scores_list = None
    hard_mode = False
    
    for arg in args:
        if arg == "--hard":
            hard_mode = True
        elif arg == "--debug":
            debug = True
        elif arg.startswith("--dbname"):
            dbname = arg.split("=")[1]
        elif arg.startswith("--dbfolder"):
            dbfolder = arg.split("=")[1]
        elif arg.startswith("--guess"):
            guesses = arg.split("=")[1].split(",")
        elif arg.startswith("--target"):
            targets = arg.split("=")[1].split(",")
        elif arg.startswith("--score"):
            for scores in arg.split("=")[1].split(";"):
                scores_list.append(scores.split(","))
                
    return Sequence(sqlite_folder=dbfolder, sqlite_dbname=dbname, targets=targets, guesses=guesses, scores_list=[], hard_mode=hard_mode, debug=debug)

class Sequence:
    def __init__(self, 
                 guesses=[],
                 targets=[],
                 scores_list=[[]], 
                 hard_mode=False, 
                 debug=False,
                 sqlite_folder=None,
                 sqlite_dbname=None, 
                 sqlite_bucket=None) :
        self.sqlite_dbname = sqlite_dbname
        self.sqlite_folder = sqlite_folder
        self.sqlite_bucket = sqlite_bucket
        self.common_wordle = Wordle.Wordle(sqlite_folder=sqlite_folder, sqlite_dbname = sqlite_dbname, sqlite_bucket = sqlite_bucket)
        self.hard_mode = hard_mode
        self.debug = debug
        self.targets = targets
        
        good_indexes = list(filter(lambda k : guesses[k] and guesses[k] != '', range(len(guesses))))
        
        self.guesses = list(map(lambda k: guesses[k], good_indexes))
        if scores_list:
            self.scores_list = scores_list;
        else:
            self.scores_list = list(map(lambda target: self.common_wordle.score_guesses(target, self.guesses), targets))

        self.wordles = []
        for n in range(len(self.scores_list)):
            target = self.targets[n] if self.targets else None
            scores = self.scores_list[n]
            wordle = Wordle.Wordle(guesses=self.guesses,
                                   target=target,
                                   scores=scores,
                                   hard_mode = False, # hard_mode is handled globally
                                   debug = self.debug,
                                   sqlite_bucket=self.sqlite_bucket,
                                   sqlite_folder=self.sqlite_folder,
                                   sqlite_dbname = self.sqlite_dbname)
            self.wordles.append(wordle)

    def current_wordle(self):
        for wordle in self.wordles:
            if not wordle.is_solved():
                return wordle
        return None

    def is_solved(self):
        return not self.current_wordle()

    # api

    def rate_solution(self):
        if not self.targets:
            return {"error": "Rating requires targets."}

        target_ratings = {}
        for wordle in self.wordles:
            target_ratings[wordle.target] = wordle.rate_solution()
        return {
            "by_target": target_ratings
        }

    def remaining_answers(self):
        current = self.current_wordle()
        if not current:
            return [[]]
        else:
            return [current.remaining_answers()]

    def guess(self, count):
        return self.current_wordle().guess(count)

    def solve(self):
        if not self.targets:
            return {"error": "Solve requires targets."}
        
        turns = []
        turn = 1

        for k in range(len(self.guesses)):
            guess = self.guesses[k]
            turns.append({"guess": guess,
                          "turn": turn})
            turn = turn + 1

        while not self.is_solved():
            next_guess = self.guess(1)[0]
            guess = next_guess['guess']
            next_guess['turn'] = turn

            self.guesses.append(next_guess['guess'])
            for k in range(len(self.wordles)):
                wordle = self.wordles[k]
                target = self.targets[k]
                if not wordle.is_solved():
                    score = wordle.score_guess(target, guess)
                    wordle.scores.append(score)
                    wordle.guesses.append(guess)
            next_guess['turn'] = turn
            turn = turn + 1
            turns.append(next_guess)

        return turns

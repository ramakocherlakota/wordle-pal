import json, sys, os
from Wordle import Wordle
from Quordle import Quordle

def respond(output, status) :
    headers = {}
    if "CORS_ORIGIN" in os.environ:
        headers = {
            "Access-Control-Allow-Headers": 
            "Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token",
            "Access-Control-Allow-Methods": "GET,POST",
            "Access-Control-Allow-Origin": os.environ.get("CORS_ORIGIN")
        }

    return {
        "headers": headers,
        "statusCode": status,
        "body": json.dumps(
            output
        )
    }

def ok(output) :
    return respond(output, 200)

def error(output) :
    return respond(output, 500)

def handler(event, context) :
    try :
        if 'body' in event:
            data = event['body']
            # deserialize if necessary
            try:
                if type(data) is str:
                    data = json.loads(data)
            except:
                return error("Unable to parse JSON - did you forget to specify Content-type=application/json on your request?")
    
            if data['operation'].startswith("q"):
                quordle = Quordle(sqlite_dbname = data.get('sqlite_dbname', os.environ.get('SQLITE_DBNAME')),
                                  sqlite_folder = data.get('sqlite_folder', os.environ.get('SQLITE_FOLDER')),
                                  debug = data.get("debug", False),
                                  scores_list = data.get("scores_list", []),
                                  guesses = data.get("guesses", []),
                                  hard_mode = data.get('hard_mode', False))
    
                if data['operation'] == "qguess":
                    return ok(quordle.guess())
    
                if data['operation'] == "qsolve":
                    return ok(quordle.solve(data['targets'], data.get("start_with", [])))
    
            else:
                wordle = Wordle(sqlite_dbname = data.get('sqlite_dbname', os.environ.get('SQLITE_DBNAME')),
                                sqlite_folder = data.get('sqlite_folder', os.environ.get('SQLITE_FOLDER')),
                                debug = data.get("debug", False),
                                hard_mode = data.get('hard_mode', False),
                                guess_scores = data.get('guess_scores', []))
    
                if data['operation'] == "remaining_answers":
                    remaining = wordle.remaining_answers()
                    return ok(list(map(lambda x: {"word" : x}, remaining)))
    
                if data['operation'] == "guess":
                    return ok(wordle.guesses(data.get("count", 1)))

                if data['operation'] == "rate_guess":
                    return ok(wordle.guess(data.get("guess", None)))
    
                if data['operation'] == "rate_all_guesses":
                    return ok(wordle.rate_all_guesses())
    
                if data['operation'] == "solve":
                    return ok(wordle.solve(data['target'], data.get("start_with", [])))
    
                if data['operation'] == "list_guesses":
                    return ok(wordle.list_all_guesses())
    
                if data['operation'] == "list_answers":
                    return ok(wordle.list_all_answers())

                if data['operation'] == "list_scores":
                    return ok(wordle.list_all_scores())
                
    except Exception as e:
        return error(e.args)

if __name__ == "__main__":
    with open(sys.argv[1]) as file:
        data = json.load(file)
        print(handler({"body": data}, None)['body'])

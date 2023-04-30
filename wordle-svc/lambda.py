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
    
            quordle = Quordle(sqlite_dbname = data.get('sqlite_dbname', os.environ.get('SQLITE_DBNAME')),
                              sqlite_folder = data.get('sqlite_folder', os.environ.get('SQLITE_FOLDER')),
                              debug = data.get("debug", False),
                              scores_list = data.get("scores_list", []),
                              guesses = data.get("guesses", data.get("start_with", [])),
                              targets = data.get("targets", []),
                              hard_mode = data.get('hard_mode', False))
            
            count = data.get("count", None)
            
            if data['operation'] == 'qrate_solution':
                return ok(quordle.rate_solution());
            
            if data['operation'] == "qguess":
                return ok(quordle.guess(count))
            
            if data['operation'] == "qremaining_answers":
                return ok(quordle.remaining_answers())
            
            if data['operation'] == "qsolve":
                return ok(quordle.solve());
                
    except Exception as e:
        return error(e.args)

if __name__ == "__main__":
    with open(sys.argv[1]) as file:
        data = json.load(file)
        print(handler({"body": data}, None)['body'])

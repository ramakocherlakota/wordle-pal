# Wordle Presentation - Level Up 2022

Link to presentation slides: [here](https://docs.google.com/presentation/d/1gkt_OCE6O3TcbdP1vEmrwHxkC7opjAI2g7cmMC8Pug4/edit#slide=id.g15908f925a1_0_162).

## Prepping for using this code

You'll need to create Sqlite databases for the scripts to access.  The data files for creating the databsses are in the `db` directory - the actual Sqlite database files were too large to commit to Github so you'll need to run a script to create the db.

In the `db` directory, execute:
```
./create_db.sh wordle.sqlite scores.txt.gz
```
This will create a Sqlite database (in `wordle.sqlite`) and load it with the data it needs. This is the default configuration and is enough for running almost all the scripts referred to in the presentation.  The other files are used for answering slightly different questions.  `mm-scores.txt.gz` is used for Mastermind mode - where the location of a matching letter is not included in the response.  `all-scores.txt.gz` is for when you want to include all guesses that Wordle allows, not just the ones that are actually answers.  (That file is much bigger, of course, as is the Sqlite db it creates and the queries are correspondingly slower.)  If you want an even bigger list, `dictionary-words-scores-*.txt.gz` is all the five letter words from `/usr/share/dict/words` - you can load multiple files by 

```
./create-db.sh dictionary-words.sqlite dictionary-words-scores-*.txt.gz
```

Because the default Sqlite doesn't have a native `log` function we also create a lookup table for base 2 logarithms of positive integers.

The `create-db.py` prints out a number after every 1000 records loaded.  It takes a while to load all of it.  It has to load 2315 * 2315 = 5.3M records so you'll know when it's getting close.

## The python code

The python scripts are in the `wordle` directory.  The `Wordle.py` and `Quordle.py` files are modules used by the scripts.  The scripts are:

1. `guess.py` : given a series of Wordle guesses and responses, recommends a next guess.
2. `qguess.py` : given a series of Quordle guesses and responses, recommends a next guess.
3. `solve.py` : solves a Wordle for a particular word.
4. `qsolve.py` : solves a Quordle for a particular set of words.
5. `remaining-answers.py`: given a series of Wordle guesses and responses prints out a list of answers that are still possible.

The following arguments are taken by all of the scripts:
*  `--debug`: print out the SQL being executed.  Defaults to False.
*  `--hard`: run in hard mode - each of the guesses must be a word consistent with what we already know.  In Quordle, this means that the guess must be consistent with at least one of the component Wordles.  Defaults to False.
*  `--dbname`: name of a Sqlite db file to use.  Default is `wordle.sqlite`.
*  `--dbfolder`: path to the Sqlite db file.  Default is `../db`

For `remaining-answers.py` and `guess.py`, the known guesses and responses are added as name=value pairs.  So, something like:
```
python guess.py trice=--wbb salon=----w
{
    "guess": "mince",
    "expected_uncertainty_after_guess": 0.0,
    "compatible": true,
    "uncertainty_before_guess": 1.5849625007211563
}
```

For `solve.py`, you can add starting words with a `--start=` argument, as a comma-delimited list.  So, for instance,
```
python solve.py --start=trice,salon audit
[
    {
        "guess": "trice",
        "score": "W-W--",
        "turn": 1
    },
    {
        "guess": "salon",
        "score": "-W---",
        "turn": 2
    },
    {
        "guess": "admit",
        "expected_uncertainty_after_guess": 0.0,
        "compatible": true,
        "uncertainty_before_guess": 1.5849625007211563,
        "score": "BW-BB",
        "turn": 3
    },
    {
        "guess": "audit",
        "expected_uncertainty_after_guess": 0,
        "compatible": true,
        "uncertainty_before_guess": 0.0,
        "score": "BBBBB",
        "turn": 4
    }
]
```

In the output, `compatible` is a flag for whether a particular guess is compatible with existing information about the solution.  (In hard mode, it should always be true.)

For the Quordle scripts (`qguess.py` and `qsolve.py`) the input is a little more complicated.  For `qguess.py` we need to specify a list of guesses we've already made and the responses that have come back for each target word.  The expected input looks like:
```
python qguess.py --guesses=trice,salon --scores="-----,bbb--;bb--b,-w---;--w--,-ww-b;w-b--,--w-w"
```
where the `guesses` arg is a list of guesses that have been made and `scores` is a list of list of responses.  These response lists are separated by semicolons and the responses within each list are separated by commas.  (You'll definitely want to put these in quote since the Unix shell will try to interpret the semicolons as separating commands.)  So, the above command instructs the program to figure out the best next guess, where the guesses so far have been "TRICE" and "SALON" and the responses have been, for word 1, `-----` and `BBB--`; for word 2, `BB--B` and `-W---`; etc.

For `qsolve.py` the input is a little simpler, something like:
```
python qsolve.py --start=trice,salon dough clump grass alibi
```
means to solve the four-word Quordle DOUGH, CLUMP, GRASS, and ALIBI, starting with TRICE, SALON.  

## Best first guesses and first two guesses

The `good-guesses` directory contains lists of best first guesses and best two-guesses.  

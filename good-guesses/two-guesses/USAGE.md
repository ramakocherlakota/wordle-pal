# List of Best First Two Words

## The script

This directory contains code and output for computing the best pairs of starting words for Wordle, assuming you don't use any information from the outcome of the first guess in choosing the second guess. So, the idea is you just blindly guess the first two words and then really start using the scores in your third guess.

Run `two-guesses-sqlite.py` in this directory. It reads scores directly from `db/plausible-wordle.sqlite`:
```
python3 two-guesses-sqlite.py --pool answers --top 50     # both words must be possible answers (~2.5 min)
python3 two-guesses-sqlite.py --top 50                    # any allowed guess (~30 min)
python3 two-guesses-sqlite.py --pair trice,salon --pair clint,soare   # exact rank of specific pairs
```
Options:
* `--pool answers|all`: where both guesses are drawn from. `all` (the default) uses all 14855 allowed guesses. `answers` uses only the 3403 plausible answers.
* `--top N`: how many of the best pairs to print (default 100).
* `--pair w1,w2`: report this pair's score and its exact rank among all pairs in the pool. You can repeat it, and it defaults to `trice,salon`.
* `--db PATH`: use a different sqlite db.

The first run reads the 50M scores out of sqlite (about 30s) and caches them as a hidden `.scores-*.npy` file next to the script. The cache name includes the db's size and mtime, so rebuilding the db invalidates it. The cache files are gitignored.

Output is `rank word1 word2 bits` for the top pairs, followed by a `#` line for each `--pair`. `two-guesses-plausible-top50.txt` holds the output of the full (`--pool all`) run.

The old `two-guesses.py` (and its output `two-guesses.txt.gz`) used the original 2315-word answer list and score text files that no longer exist. It took about twenty hours to run.

## Results (plausible-wordle db)

| rank | pair | bits left |
|---|---|---|
| 1 | clint soare | 1.939 |
| 2 | ceorl saint | 1.940 |
| 3 | clote sarin | 1.953 |
| 4 | riant socle | 1.955 |
| 5 | colin tarse | 1.962 |
| 11 | salon trice | 1.971 |

Out of 110,328,085 pairs, `salon trice` ranks 11th. Restricted to pairs of possible answers, it's still #1 out of 5,788,503, ahead of `cline roast` (1.979) and `cairn stole` (1.999). It was also #1 with the old 2315-word answer list (1.59 bits).

## How it works

For each pair of words `guess1` and `guess2`, the script
1. Iterates through all the answers, computing the scores for `guess1` and `guess2`.
2. Keeps track of how often each pair of scores `score1` and `score2` shows up.  The more often a given pair shows up, the higher the leftover uncertainty after you've made those guesses and received those scores.  For instance, suppose
    * You guess 'golly' and get back 'b-w--'
    * You guess 'stick' and get back '--b--'
The only word that matches those starting guesses and scores is 'glide' so there is no uncertainty left at this point - you can guess the answer on your third guess.
Of course, this isn't necessarily a very likely situation.  If the scores that come back are 'w----' and '--b--' instead, then there are ten words that match ("aging", "aping", "being", "bring", "deign", "feign", "neigh", "reign", "weigh", "wring") and the uncertainty after these two guesses and responses is log(10) = 3.32 bits.
3. Computes the expected uncertainty for each pair.  This is just the sum of the uncertainties, weighted for how likely they are: `sum(c * log2(c)) / num_answers`, where `c` ranges over the counts from step 2.  With the old answer list, the expected uncertainty for `golly` and `stick` was 3.45 bits, ranked 989868 out of 2678455 pairs.  So solidly mediocre.

The new script does steps 1–3 for many second words at once with numpy. It also skips pairs that can't make the list. Two guesses can't tell you more than the sum of what each tells you alone, so

    rem(g1, g2) >= rem(g1) + rem(g2) - log2(num_answers)

where `rem(g)` is the expected uncertainty after the single guess `g`. The script goes through first words from best to worst single-guess score. For each one, it only scores the partners that could still beat the current cutoff, which is the worst of the top N (or the worst `--pair`, if that's higher). It stops once no partners are left. For the full pool, this means scoring about 18M of the 110M pairs.

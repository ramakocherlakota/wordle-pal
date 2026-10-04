"""Find the best pairs of "blind" first two guesses using the plausible-wordle sqlite db.

For each pair (guess1, guess2) we compute the expected remaining uncertainty
(in bits) about the answer after seeing both scores:

    sum over score-pairs of  c * log2(c) / num_answers

where c is the number of answers that produce that pair of scores.  Lower is
better.  This is the same metric as two-guesses.py, but:

  * scores come straight from the sqlite db (cached as a .npy next to this script)
  * it's vectorized with numpy
  * it prunes pairs that can't possibly make the top list: the information
    from two guesses is at most the sum of their individual information, so
        rem(g1, g2) >= rem(g1) + rem(g2) - log2(num_answers)

Usage:
    python two-guesses-sqlite.py                       # both guesses from the full guess list
    python two-guesses-sqlite.py --pool answers        # both guesses must be possible answers (old behaviour)
    python two-guesses-sqlite.py --top 200 --pair trice,salon --pair crane,doilt
"""

import argparse
import heapq
import math
import os
import sqlite3
import sys
import time

import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
DEFAULT_DB = os.path.join(HERE, "..", "..", "db", "plausible-wordle.sqlite")


def log(msg):
    print(msg, file=sys.stderr, flush=True)


def load(db_path):
    """Return (guesses, answers, R) where R[g, a] is the response index (uint8)."""
    con = sqlite3.connect(db_path)
    answers = [r[0] for r in con.execute("select answer from answers order by answer")]
    guesses = [r[0] for r in con.execute("select guess from guesses order by guess")]

    real_db = os.path.realpath(db_path)
    stamp = f"{os.path.getsize(real_db)}-{int(os.path.getmtime(real_db))}"
    cache = os.path.join(HERE, f".scores-{os.path.basename(real_db)}-{stamp}.npy")
    if os.path.exists(cache):
        log(f"loading cached score matrix {cache}")
        R = np.load(cache)
    else:
        log("reading scores from sqlite (one-time, cached afterwards)...")
        t0 = time.time()
        responses = {r[0]: i for i, r in enumerate(con.execute("select score from responses order by score"))}
        assert len(responses) < 256
        flat = np.empty(len(guesses) * len(answers), dtype=np.uint8)
        # scores' primary key is (guess, answer) without rowid, so this is a straight scan
        cur = con.execute("select score from scores order by guess, answer")
        pos = 0
        while True:
            rows = cur.fetchmany(1_000_000)
            if not rows:
                break
            flat[pos:pos + len(rows)] = [responses[r[0]] for r in rows]
            pos += len(rows)
        assert pos == len(flat), f"expected {len(flat)} scores, got {pos}"
        R = flat.reshape(len(guesses), len(answers))
        np.save(cache, R)
        log(f"  done in {time.time() - t0:.0f}s")
    con.close()
    return guesses, answers, R


def single_rem(R, L):
    """Expected remaining bits after a single guess, for every guess."""
    G, A = R.shape
    out = np.empty(G)
    for i in range(G):
        c = np.bincount(R[i], minlength=256)
        out[i] = (c * L[c]).sum() / A
    return out


def pair_rem(R, L, i, js, max_bins=1 << 24):
    """Expected remaining bits for pairs (i, j) for every j in js."""
    G, A = R.shape
    r1 = R[i]
    # compress guess1's responses to 0..k1-1 so the joint key space is small
    _, c1 = np.unique(r1, return_inverse=True)
    k1 = int(c1.max()) + 1
    base = c1.astype(np.int64) * 256
    width = k1 * 256
    batch = max(1, max_bins // width)
    out = np.empty(len(js))
    for s in range(0, len(js), batch):
        jj = js[s:s + batch]
        n = len(jj)
        keys = base[None, :] + R[jj] + (np.arange(n, dtype=np.int64) * width)[:, None]
        counts = np.bincount(keys.ravel(), minlength=n * width)
        # sum over answers of log2(size of its class) == sum over classes of c*log2(c)
        out[s:s + n] = L[counts[keys]].sum(axis=1) / A
    return out


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--db", default=DEFAULT_DB)
    ap.add_argument("--pool", choices=["all", "answers"], default="all",
                    help="where guesses are drawn from (default: all allowed guesses)")
    ap.add_argument("--top", type=int, default=100, help="how many of the best pairs to print")
    ap.add_argument("--pair", action="append", default=[],
                    help="a pair 'w1,w2' whose score and exact rank to report (repeatable; default trice,salon)")
    args = ap.parse_args()
    pairs = [tuple(p.lower().split(",")) for p in (args.pair or ["trice,salon"])]

    guesses, answers, R = load(args.db)
    G, A = R.shape
    log(f"{G} guesses x {A} answers")
    L = np.zeros(A + 1)
    L[1:] = np.log2(np.arange(1, A + 1))
    logA = math.log2(A)

    gidx = {g: i for i, g in enumerate(guesses)}
    if args.pool == "answers":
        pool = np.array(sorted(gidx[a] for a in answers if a in gidx))
    else:
        pool = np.arange(G)

    t0 = time.time()
    rem1 = single_rem(R, L)
    log(f"single-guess scores in {time.time() - t0:.0f}s; best: "
        + ", ".join(f"{guesses[i]} {rem1[i]:.4f}" for i in np.argsort(rem1)[:5]))

    # score the pairs we want ranked; they set a floor on the pruning threshold
    targets = []
    for w1, w2 in pairs:
        if w1 not in gidx or w2 not in gidx:
            sys.exit(f"{w1},{w2}: not in guess list")
        targets.append((w1, w2, pair_rem(R, L, gidx[w1], np.array([gidx[w2]]))[0]))
    target_max = max(t[2] for t in targets)
    better = [0] * len(targets)  # number of pairs strictly better than each target

    order = pool[np.argsort(rem1[pool], kind="stable")]
    rem_sorted = rem1[order]
    top = []  # max-heap via negation: (-score, g1, g2)
    evaluated = 0
    eps = 1e-9

    t0 = time.time()
    last = t0
    for p in range(len(order)):
        thresh = max(target_max, -top[0][0] if len(top) >= args.top else math.inf)
        # partner must satisfy rem1[g2] <= thresh - rem1[g1] + logA (and come later in the order)
        limit = thresh - rem_sorted[p] + logA + eps
        end = np.searchsorted(rem_sorted, limit, side="right")
        if end <= p + 1:
            break
        i = order[p]
        js = order[p + 1:end]
        scores = pair_rem(R, L, i, js)
        evaluated += len(js)

        for k, (_, _, ts) in enumerate(targets):
            better[k] += int((scores < ts - eps).sum())
        # only bother pushing candidates that could make the list
        if len(top) >= args.top:
            cand = np.flatnonzero(scores < -top[0][0])
        else:
            cand = np.argsort(scores)[:args.top]
        for c in cand:
            item = (-scores[c], guesses[i], guesses[js[c]])
            if len(top) < args.top:
                heapq.heappush(top, item)
            elif item > top[0]:
                heapq.heapreplace(top, item)

        now = time.time()
        if now - last > 30:
            last = now
            log(f"  {p}/{len(order)} first words ({guesses[i]}, rem {rem_sorted[p]:.3f}), "
                f"{evaluated:,} pairs, {len(js):,} partners, threshold {thresh:.4f}, {now - t0:.0f}s")

    total_pairs = len(order) * (len(order) - 1) // 2
    log(f"evaluated {evaluated:,} of {total_pairs:,} pairs in {time.time() - t0:.0f}s")

    for rank, (neg, g1, g2) in enumerate(sorted(top, key=lambda t: (-t[0], t[1], t[2])), 1):
        a, b = sorted((g1, g2))
        print(f"{rank} {a} {b} {-neg:.6f}")
    for k, (w1, w2, ts) in enumerate(targets):
        print(f"# {w1},{w2}: {ts:.6f}  rank {better[k] + 1:,} of {total_pairs:,} ({args.pool} pool)")


if __name__ == "__main__":
    main()

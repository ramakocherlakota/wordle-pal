import AnswerOptions from '../data/AnswerOptions';

function countIn(c, w) {
  let num = 0;
  for (let k = 0; k < w.length; k += 1) {
    if (w[k] === c) {
      num += 1;
    }
  }
  return num;
}


export function scoreSingle(answer, guess) {
  let score = ""
  const answerCounts = {}
  const minCounts = {}
  for (let i = 0; i < answer.length; i += 1) {
    const c = answer[i];
    answerCounts[c] = countIn(c, answer)
  }

  for (let j = 0; j < guess.length; j += 1) {
    const c = guess[j];
    if (c in answerCounts) {
      const gc = countIn(c, guess);
      minCounts[c] = gc < answerCounts[c] ? gc : answerCounts[c];
    }
  }

  for (let k = 0; k < answer.length; k += 1) {
    const g = guess[k];
    if (g === answer[k]) {
      score += "B"
      minCounts[g] -= 1
    }
    else {
      score += "-";
    }
  }

  for (let r = 0; r < answer.length; r += 1) {
    const g = guess[r];
    if (score[r] === "-") {
      if (g in minCounts &&  minCounts[g] > 0) {
        score = score.substring(0, r) + "W" + score.substring(r + 1)
        minCounts[g] -= 1;
      }
    }
  }
  return score;
}

export function score(targets, guess) {
  const scoreGuess = (target) => scoreSingle(target, guess);
  return targets.map(scoreGuess);
}

export function scoreListIsSolved(scoreList) {
  const check = (score) => score.toLowerCase() === "bbbbb";
  return scoreList && scoreList.some(check);
}

export function maxGuessCount(scoreLists) {
  const lengths = scoreLists.map(sl => sl.length);
  return Math.max(...lengths);
}

export function checkHardModeSingle(scoreList, guesses, guess) {
  for (let i = 0; i < guesses.length; i += 1) {
    if (scoreSingle(guesses[i], guess) !== scoreList[i]) {
      return false;
    }
  }
  return true;
}

export function checkHardMode(scoreLists, guesses, guess) {
  const check = (scoreList) => checkHardModeSingle(scoreList, guesses, guess);
  return scoreLists && scoreLists.some(check);
}

export function chooseRandomAnswer() {
  const answerOptions = AnswerOptions();
  const answers = Object.keys(answerOptions).flatMap(k => answerOptions[k]);
  return answers[Math.floor(answers.length * Math.random())];
}

export function classifyLetters(guesses, scoreList) {
  // repeated letters are a headache here.  what we want to say is basically:
  // if a letter is ever given a black score, count it as black
  // if it is ever given a white score but not a black score, count it as white
  // otherwise give it a gray

  // letters that have not been guessed are given a none score

  const classified = {
    "a": 'none',
    "b": 'none',
    "c": 'none',
    "d": 'none',
    "e": 'none',
    "f": 'none',
    "g": 'none',
    "h": 'none',
    "i": 'none',
    "j": 'none',
    "k": 'none',
    "l": 'none',
    "m": 'none',
    "n": 'none',
    "o": 'none',
    "p": 'none',
    "q": 'none',
    "r": 'none',
    "s": 'none',
    "t": 'none',
    "u": 'none',
    "v": 'none',
    "w": 'none',
    "x": 'none',
    "y": 'none',
    "z": 'none'
  };
  for (let i=0; i<guesses.length; i++) {
    // first pull out the scores for each letter in each guess
    
    const guess = guesses[i];
    const score = scoreList[i];

    // assemble the letters that are given a black in this guess
    const black = guess.split("").map((ch, j) => {
      if (score[j].toLowerCase() === 'b') {
        return ch;
      } else {
        return null;
      }
    }).filter(Boolean);

    // and the whites that are not already black
    const white = guess.split("").map((ch, j) => {
      if (score[j].toLowerCase() === 'w' && ! black.includes(ch)) {
        return ch;
      } else {
        return null;
      }
    }).filter(Boolean);

    // and the ones that are rejected, assuming they haven't already been marked as black or white
    const gray = guess.split("").map((ch, j) => {
      if (score[j].toLowerCase() === '-' && ! white.includes(ch) && ! black.includes(ch)) {
        return ch;
      } else {
        return null;
      }
    }).filter(Boolean);

    for (const ch in black) {
      classified[black[ch]] = 'black';
    }
    for (const ch in white) {
      // a white letter might have been marked as black in previous guess, don't want to overwrite that
      if (classified[white[ch]] !== 'black') {
        classified[white[ch]] = 'white';
      }
    }

    // don't need to worry about those kinds of issues for gray - if a letter is gray
    // in this guess that means it would have been gray in all guesses
    for (const ch in gray) {
      classified[gray[ch]] = 'gray';
    }
  }
  return classified;
} 

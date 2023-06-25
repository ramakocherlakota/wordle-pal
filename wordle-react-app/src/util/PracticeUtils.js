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
  for (let i = 0; i < guess.legnth; i += 1) {
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

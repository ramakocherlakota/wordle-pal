import React from 'react';
import './practice-scores.scss';

export default function PracticeScores({ finished, guesses, scoreLists, targets, solvedPuzzles }) {
  console.log(solvedPuzzles);

  function spaceOut(str) {
    return str.split("").join(" ");
  }

  function formatHeader() {
    const headers = targets.map((target, i) => {
      if (solvedPuzzles.includes(i)) {
        console.log(`${target} is solved`);
        return <th key={i}>{target}</th>;
      } else {
        return <th key={i}>?????</th>;
      }
    })

    return (
      <tr key="-1">
        <th>&nbsp;</th>
        {headers}
      </tr>
    );
  }

  function formatGuessScores(guess, scores, k) {
    return (
      <tr key={k}>
        <th key={k}>{guess}</th>
        {scores.map((score, i) =>
          <td key={i}>{spaceOut(score)}</td>
        )}
      </tr>
    );
  }

  return (
    <table className='practice-scores'>
      <thead>
        {formatHeader()}
      </thead>
      <tbody>
      {
        guesses && scoreLists && guesses.map((guess, index) => {
          const scores = scoreLists.map(sl => sl[index]);
          return formatGuessScores(guess, scores, index);
        }
       )}
      </tbody>
    </table>
  );
}

import React from 'react';
import './practice-scores.scss';

export default function PracticeScores({ finished, guesses, scoreLists, targets, solvedPuzzles }) {
  function spaceOut(str) {
    if (str) {
      return str.split("").join(" ");
    } else {
      return str;
    }  
  }

  function formatHeader() {
    const headers = targets.map((target, i) => {
      const solved = solvedPuzzles.includes(i);
      if (finished || solved) {
        return <th className={solved ? "solved" : ""} key={i}>{target}</th>;
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
        {scores.map((score, i) => {
          const solved = solvedPuzzles.includes(i);
          return <td className={solved ? "solved" : ""} key={i}>{spaceOut(score)}</td>
        }
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

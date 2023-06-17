import React from 'react';
import './practice-scores.scss';

export default function PracticeScores({ finished, guesses, scoreLists }) {

  function spaceOut(str) {
    return str.split("").join(" ");
  }

  function formatGuessScores(guess, scores) {
    return (
      <tr>
        <th>{guess}</th>
              {scores.map(score =>
                <td>{spaceOut(score)}</td>
              )}
      </tr>
    );
  }

  return (
    <table className='practice-scores'>
      <tbody>
      {
        guesses && scoreLists && guesses.map((guess, index) => {
          const scores = scoreLists.map((sl) => sl[index]);
          return formatGuessScores(guess, scores);
        }
       )}
      </tbody>
    </table>
  );
}

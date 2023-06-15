import React, {useState} from 'react';
import './practice-scores.scss';

export default function PracticeScores({ finished, guesses, scoreLists }) {

  function formatGuessScores(guess, scores) {
    return (
      <div className='practice-guess-scores'>
        <div className='practice-guess'>
          {guess}
        </div>
        {scores.map((score, idx) => 
          <div key={idx} className="practice-score">
            {score}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className='practice-guess-scores'>
      {
        guesses && scoreLists && guesses.map((guess, index) => {
          const scores = scoreLists.map((sl) => sl[index]);
          return formatGuessScores(guess, scores);
        }
      )}
    </div>
  );
}

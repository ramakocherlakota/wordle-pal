import React from 'react';
import ColoredScore from './ColoredScore';
import LetterBox from './LetterBox';
import './practice-scores.scss';

export default function PracticeScores({ finished, showBW, guesses, scoreLists, targets, solvedPuzzles, sequence, maxGuessCount }) {

  function firstUnsolvedColumn() {
    if (!sequence) {
      return targets.length;
    }

    const unsolvedPuzzles = targets.map((target, i) => {
      return solvedPuzzles.includes(i) ? -1 : i;
    }).filter(it => it >= 0);
    
    return Math.min(...unsolvedPuzzles);
  }

  const hideColumnsBeginning = firstUnsolvedColumn() + 1;

  function spaceOut(score, guess, i) {
    if (i >= hideColumnsBeginning) {
      return "";
    }
    if (score) {
      if (showBW) {
        return score.split("").join(" ");
      } else {
        return <ColoredScore score={score} guess={guess} />
      }
    } else {
      return score;
    }  
  }

  function formatFooter() {
    const footers = targets.map((target, i) => {
      const solved = solvedPuzzles.includes(i);
      if (finished || solved) {
        return <th className={solved ? "solved" : ""} key={i}>{target}</th>;
      } else {
        const letterBox = (
            <LetterBox guesses={guesses} scoreList={scoreLists[i]} showBW={showBW} hidden={hideColumnsBeginning <= i} />
        );            
        return <th key={i} className='letterbox-icon'>{letterBox}</th>;
      }
    })

    return (
      <tr key="-1">
        {
          showBW && <th>&nbsp;</th>
        }
        {footers}
      </tr>
    );
  }


  function emptyRows(count) {
    let rows = [];
    for (let i=0; i < count; i++) {
      let row = [
        showBW && <th key={-i-2}>&nbsp;</th>          
      ];
      row = [
        ...row,
        targets.map((target, col) => {
          const solved = solvedPuzzles.includes(col);
          return <td className={solved ? "solved" : ""} key={col}>&nbsp;</td>
        })
      ];
      rows = [...rows, 
              <tr key={-i-2}>{row}</tr>];
    }
    return rows;
  }

  function formatGuessScores(guess, scores, k) {

    return (
      <tr key={k}>
        {
          showBW && <th key={k}>{guess}</th>
        }
        {scores.map((score, i) => {
          const solved = solvedPuzzles.includes(i);
          return <td className={solved ? "solved" : ""} key={i}>{spaceOut(score, guess, i)}</td>
        }
        )}
      </tr>
    );
  }

  return (
    <table className='practice-scores'>
      <tbody>
      {
        emptyRows(maxGuessCount - guesses.length)
       }
        {
          scoreLists && guesses.map((guess, index) => {
          const scores = scoreLists.map(sl => sl[index]);
          return formatGuessScores(guess, scores, index);
        }
       )}
      </tbody>
      <tfoot>
        {formatFooter()}
      </tfoot>
    </table>
  );
}

import React from 'react';
import './colored-score.scss';

export default function ColoredScore({ score, guess, setScore }) {
  const fixedScore = score ? score : "-----";
  const splitScore = fixedScore.toLowerCase().split("");
  const splitGuess = guess.split("");

  function roll(c) {
    if (c === "-") {
      return "b"
    } else {
      if (c === "b") {
        return "w";
      }
    }
    return "-";
  }

  function clickHandler(i) {
    if (setScore) {
      return () => {
        const rolled = roll(fixedScore.substr(i, 1));
        const newScore = fixedScore.substr(0, i) + rolled + fixedScore.substr(i+1);
        setScore(newScore);
      }
    } else {
      return () => {};
    }
  }

  const row = splitGuess.map((g, i) => {
    const onClick = clickHandler(i);
    const colorClassName = splitScore[i] === "w" ? "white" : splitScore[i] === "b" ? "black" : "gray";
    const className = setScore ? `colored-cell ${colorClassName} clickable` : `colored-cell ${colorClassName}`;
    return <div key={i} onClick={onClick} className={className}>{g.toUpperCase()}</div>;
  });
  return (
    <div className='colored-score'>
      {row}
    </div>
  );

}


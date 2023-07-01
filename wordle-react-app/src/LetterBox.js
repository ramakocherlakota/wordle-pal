import React, { useState }  from 'react';
import { classifyLetters } from './util/Util';
import './letter-box.scss';

export default function LetterBox({guesses, scoreList, showBW, hidden}) {
  const [ open, setOpen ] = useState(false);

  const toggleOpen = () => {
    setOpen( o => !o);
  };

  const classifiedLetters = classifyLetters(guesses, scoreList);
  console.log(classifiedLetters);

  const qwerty = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    [" ", "Z", "X", "C", "V", "B", "N", "M", " "]
  ];
  
  function makeRow(row) {
    const keyboardRow = row.map(ch => {
      const state = classifiedLetters[ch.toLowerCase()];
      const className = state > 0 ? "key found" : (state < 0 ? "key missing" : "key unknown");
      return <div className={className}>{ch}</div>;
    })
    return (
      <div className='keyboard-row'>{keyboardRow}</div>
    );
  }

  const className = hidden ? "keyboard" : "keyboard clickable";
  return (
    <div className={className} onClick={!hidden && toggleOpen}>
    {
      open && qwerty.map(makeRow)
    }
    {
      (!hidden && !open) && "letters..."
    }
    {
      hidden && !open && "?????"
    }        
    </div>
  );

}

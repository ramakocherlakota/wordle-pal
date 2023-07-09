import React, { useState }  from 'react';
import { classifyLetters } from './util/PracticeUtils';
import { ABCEmoji } from './util/Emojis';
import './letter-box.scss';

export default function LetterBox({guesses, scoreList, showBW, hidden, setGuessInput}) {
  const [ open, setOpen ] = useState(false);

  const toggleOpen = () => {
    setOpen( o => !o);
  };

  const classifiedLetters = classifyLetters(guesses, scoreList);

  const qwerty = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    [" ", "Z", "X", "C", "V", "B", "N", "M", " "]
  ];
  
  function appendLetter(ch) {
    if (ch !== ' ') {
      return function(e) {
        e.stopPropagation();
        setGuessInput(input => input + ch.toLowerCase());
      }
    }
  }

  function makeRow(row, i) {
    const keyboardRow = row.map((ch, i) => {
      const state = classifiedLetters[ch.toLowerCase()];
      const className = `key ${state}`;
      return <div key={i} className={className} onClick={appendLetter(ch)} >{ch}</div>;
    })
    return (
      <div key={i} className='keyboard-row'>{keyboardRow}</div>
    );
  }

  const alphabet = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"]

  function monochromeOutput() {
    const black = alphabet.filter(ch => classifiedLetters[ch] === 'black').join(" ").toUpperCase();
    const white = alphabet.filter(ch => classifiedLetters[ch] === 'white').join(" ").toUpperCase();
    const gray = alphabet.filter(ch => classifiedLetters[ch] === 'gray').join(" ").toUpperCase();

    return (
      <table border="1">
        <tr key="black">
          <th key="label">
            B
          </th>
          <td key="black">
            {black}
          </td>
        </tr>
        <tr key="white">
          <th key="label">
            W
          </th>
          <td key="white">
            {white}
          </td>
        </tr>
      </table>
    );
  }

  function content() {
    if (hidden) {
      return "?????";
    } else {
      if (open) {
        return (
          <div className='clickable' onClick={toggleOpen}>
            { showBW && 
              <div className='monochrome'>
                {monochromeOutput()}
              </div>
            }
            <div className='keyboard' >
              {qwerty.map(makeRow)}
            </div>
          </div>
        );
      } else {
        return (
          <div className='clickable' onClick={toggleOpen}>
            {ABCEmoji()}
          </div>
        );
      }
    }
  }

  return (
    content()
  );
}

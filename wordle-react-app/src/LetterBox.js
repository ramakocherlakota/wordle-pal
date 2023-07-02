import React, { useState }  from 'react';
import { classifyLetters } from './util/Util';
import { CrossMarkEmoji, CheckMarkEmoji } from './util/Emojis';
import './letter-box.scss';

export default function LetterBox({guesses, scoreList, showBW, hidden}) {
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

  const alphabet = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"]

  function monochromeOutput() {
    const yes = alphabet.filter(ch => classifiedLetters[ch] > 0).join(" ").toUpperCase();
    const no = alphabet.filter(ch => classifiedLetters[ch] < 0).join(" ").toUpperCase();
    return (
      <>
        <div className='monochrome-list'>
          {CheckMarkEmoji()} {yes}
        </div>
        <hr/>
        <div className='monochrome-list'>
          {CrossMarkEmoji()} {no}
        </div>
      </>
    );
  }

  function content() {
    if (hidden) {
      return "?????";
    } else {
      if (open) {
        if (showBW) {
          const className = hidden ? "monochrome" : "monochrome clickable";
          return (
            <div className={className} onClick={!hidden && toggleOpen}>
              {monochromeOutput()}
            </div>
          );
        } else {
          const className = hidden ? "keyboard" : "keyboard clickable";
          return (
            <div className={className} onClick={!hidden && toggleOpen}>
              {qwerty.map(makeRow)}
            </div>
          );
        }
      } else {
        return (
          <div onClick={!hidden && toggleOpen}>
            letters
          </div>
        );
      }
    }
  }

  return (
    content()
  );
}

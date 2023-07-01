import React from 'react';
import { classifyLetters } from './util/Util';

export default function LetterBox({guesses, scoreList, showBW}) {
  
  const classifiedLetters = classifyLetters(guesses, scoreList);
  
}

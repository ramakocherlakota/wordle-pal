import React, {useState} from 'react';
import Results from './Results';
import GoButton from './GoButton';
import AnswerSelect from './AnswerSelect';
import GuessSelect from './GuessSelect';
import HardModeRow from './HardModeRow';
import AllGuessesRow from './AllGuessesRow';
import {listOfEmptyStrings, listWithAdjustedLength, replaceInList} from './Util';

export default function RateSolution(allGuesses, setAllGuesses, hardMode, setHardMode, targetCount) {
  const [ loading, setLoading ] = useState(false);
  const [ elapsedTime, setElapsedTime ] = useState(0);
  const [ targets, setTargets ] = useState(listOfEmptyStrings(targetCount));
  const [ guesses, setGuesses ] = useState([""]);
  const [ showQueryButton, setShowQueryButton ] = useState(false);
  const [ showResults, setShowResults ] = useState(false);
  const [ request, setRequest ] = useState(undefined);
  
}

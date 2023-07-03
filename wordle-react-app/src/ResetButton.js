import React from 'react';
import { ResetEmoji } from './util/Emojis';
import PopupDoc from './PopupDoc';

export default function ResetButton({ setScoreLists, setTargets, setGuesses, setLuckGuesses }) {

  function reset() {
    setScoreLists([[""]]);
    setTargets([""]);
    setGuesses([""]);
    setLuckGuesses([""]);
  }

  return (
    <PopupDoc label={ResetEmoji()} tooltip="Reset input" ok="OK" okAction={reset} >
      <div>
        Do you want to reset the targets, scores and guesses you've entered (for all the panes except Practice)?
      </div>
    </PopupDoc>
  );
}

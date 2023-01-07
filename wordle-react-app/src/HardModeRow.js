import React from 'react';
import CheckboxRow from './CheckboxRow';

export default function HardModeRow({ hardMode, setHardMode }) {
  const doc = <div>
                In Hard Mode Wordle, every guess must be consistent with the information from previous guesses and scores.  If there are more than one target word (as in Quordle) then Hard Mode means that every guess must be consistent with the guesses and scores for at least one target word.
              </div>;
  return <CheckboxRow value={hardMode} setValue={setHardMode} label="Hard Mode" doc={doc} />
}

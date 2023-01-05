import React from 'react';
import './hard-mode-row.scss';
import PopupDoc from './PopupDoc';

export default function HardModeRow({ hardMode, setHardMode }) {
  function toggle(e) {
    const newval = e.currentTarget.checked;
    setHardMode(newval);
  }

  const labelstyle = {
    textAlign: 'right'
  }

  const checkboxStyle = {
    transform: "scale(1.5)"
  }

  return (
    <>
      <div className='row hard-mode-row'>
        <div className='col' style={labelstyle} >
          <PopupDoc doc=<div>
                          In Hard Mode Wordle, every guess must be consistent with the information from previous guesses and scores.  If there are more than one target word (as in Quordle) then Hard Mode means that every guess must be consistent with the guesses and scores for at least one target word.
                        </div> >
            Hard Mode
          </PopupDoc>
        </div>
        <div className='col'>
          <input type="checkbox" style={checkboxStyle} checked={hardMode} onChange={toggle} />
        </div>
      </div>
    </>
  );
}

import React from 'react';
import './hard-mode-row.scss';

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
          Hard Mode?
        </div>
        <div className='col'>
          <input type="checkbox" style={checkboxStyle} checked={hardMode} onChange={toggle} />
        </div>
      </div>
    </>
  );
}

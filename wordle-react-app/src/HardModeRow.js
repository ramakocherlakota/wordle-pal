import React from 'react';

export default function HardModeRow({ hardMode, setHardMode }) {
  function toggle(e) {
    const newval = e.currentTarget.checked;
    setHardMode(newval);
  }

  return (
    <>
      <div className='row'>
        <div className='col'>
          Hard Mode?
        </div>
        <div className='col'>
          <input type="checkbox" checked={hardMode} onChange={toggle} />
        </div>
      </div>
    </>
  );
}

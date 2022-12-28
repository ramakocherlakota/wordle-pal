import React from 'react';

export default function HardModeRow({ hardMode, setHardMode }) {
  function toggle(e) {
    const newval = e.currentTarget.checked;
    setHardMode(newval);
  }

  return (
    <>
      <div className='extra-parameter-row'>
        <div className='extra-parameter-col'>
          Hard Mode?
        </div>
        <div className='extra-parameter-col'>
          <input type="checkbox" checked={hardMode} onChange={toggle} />
        </div>
      </div>
    </>
  );
}

import React from 'react';

export default function GuessCountRow({ count, setCount }) {

  const validateAndSet = (e) => {
    const newCount = parseInt(e.target.value);
    if (!isNaN(newCount)) {
      setCount(newCount);
    }
  }

  return (
    <>
      <div className='extra-parameter-row'>
        <div className='extra-parameter-col'>
          Guess count?
        </div>
        <div className='extra-parameter-col'>
          <input value={count} onChange={validateAndSet} />
        </div>
      </div>
    </>
  );
}

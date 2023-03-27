import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';
import './go-button.scss'

export default function GoButton({ showQueryButton, setShowQueryButton, showResults, setShowResults, loading, elapsedTime }) {
  function callQuery() {
    setShowResults(true);
    setShowQueryButton(false);
  }

  const label = loading ? 
    <Button variant="primary" disabled  >
      <div className="loading">
        <div className='loading-spinner'>
          <CircularProgress/>
        </div>
        <div className='elapsed'>
          {(elapsedTime / 1000).toFixed(0)} sec.
        </div>
      </div>
    </Button>
  : "Go";


  return (
      <div className='go-button'>
          <Button variant="contained" onClick={callQuery} disabled={!showQueryButton} >{label}</Button>
      </div>
  );
}

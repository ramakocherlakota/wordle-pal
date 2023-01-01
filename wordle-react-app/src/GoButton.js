import React from 'react';
import Button from 'react-bootstrap/Button';
import './go-button.scss'

export default function GoButton({ showQueryButton, setShowQueryButton, showResults, setShowResults }) {
  function callQuery() {
    setShowResults(true);
    setShowQueryButton(false);
  }

  return (
      <div className='go-button'>
        {showQueryButton && <Button onClick={callQuery} >Go</Button>}
      </div>
  );
}

import React from 'react';
import Button from 'react-bootstrap/Button';
import './go-button.scss'
import PopupDoc from './PopupDoc';

export default function GoButton({ showQueryButton, setShowQueryButton, showResults, setShowResults }) {
  function callQuery() {
    setShowResults(true);
    setShowQueryButton(false);
  }

  const doc = showQueryButton 
        ? <div>Click to submit query... but be patient.  Results can take minutes to come back.</div>
        : <div>You need to fill in all the data (like selecting guesses and scores) before this button will become active.</div>;

  return (
      <div className='go-button'>
          <Button onClick={callQuery} disabled={!showQueryButton} >Go</Button>
          <PopupDoc doc={doc} />
      </div>
  );
}

import React from 'react';
import Button from 'react-bootstrap/Button';
import './go-button.scss'
import Spinner from "react-bootstrap/Spinner";
import PopupDoc from './PopupDoc';

export default function GoButton({ showQueryButton, setShowQueryButton, showResults, setShowResults, loading, elapsedTime }) {
  function callQuery() {
    setShowResults(true);
    setShowQueryButton(false);
  }

  const doc = loading ? <div>Be patient... Rome wasn't built in a day!</div> :
        (showQueryButton 
         ? <div>Click to submit query... but be patient.  Results can take minutes to come back.</div>
         : <div>You need to fill in all the data (like selecting guesses and scores) before this button will become active.  Also, if you haven't made any changes since your last query, the button is disabled.</div>);

  const label = loading 
        ? <div className="loading">
            <Button variant="primary" disabled  >
              <Spinner
                className="loading-spinner"
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />{(elapsedTime / 1000).toFixed(0)} sec.
            </Button>
          </div>
        : "Go";


  return (
      <div className='go-button'>
          <Button onClick={callQuery} disabled={!showQueryButton} >{label}</Button>
          <PopupDoc doc={doc} />
      </div>
  );
}

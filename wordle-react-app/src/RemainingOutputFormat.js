import React from 'react';

export default function RemainingOutputFormat(data) {
  const { output, headers, headerLabels, headerDocs } = data;

  function dataRows(rows) {
    return (
      <div className='row'>
        <div key="guesses" className="col"/>
        {rows && rows.map((lst, idx) => {
          return (
            <div key={idx} className="col" align="left">{wordList(lst)}</div>
          );
        })}
        <div key="buttons" className="col"/>
      </div>
    );
  }

  function wordList(list) {
    if (list.length > 0) {
      return (
        list.map((it) => {
          return (
            <>
              {it}<br/>
            </>
          );
        })
      ); 
    } else {
      return <em>No matches</em>
    }
  }

  return (
    <>
      {dataRows(output)}
    </>
  );
}

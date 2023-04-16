import React from 'react';
import './remaining-output-format.scss';

export default function RemainingOutputFormat(data) {
  const { output } = data;

  function dataRows(rows) {
    return (
      <div className='row'>
        {rows && rows.map((lst, idx) => {
          return (
            <div key={idx} className="col" >{wordList(lst)}</div>
          );
        })}
      </div>
    );
  }

  function wordList(list) {
    if (list.length > 0) {
      return (
        list.map((it) => {
          return (
            <div className='cell'>
              {it}
            </div>
          );
        })
      ); 
    } else {
      return <div className='cell'><em>No matches</em></div>
    }
  }

  return (
    <>
      {dataRows(output)}
    </>
  );
}

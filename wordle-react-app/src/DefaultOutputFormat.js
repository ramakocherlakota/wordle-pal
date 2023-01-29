import React from 'react';
import PopupDoc from './PopupDoc';
import './default-output-format.scss';

export default function DefaultOutputFormat(data) {
  const { output, headers, headerLabels, headerDocs } = data;
  const headerRow = (headers && headers.map((x) => {
    const doc = headerDocs && (x in headerDocs) && headerDocs[x];
    const label = doc ? <PopupDoc doc={doc}>{headerLabels[x]}</PopupDoc> : headerLabels[x];
    return (
      <div className='cell col'>{label}</div>
    );
  }));

  function formatEntry(x, header) {
    if (typeof x === 'number') {
      if (header === 'compatible') {
        return x > 0 ? "true" : "false";
      } else if (header === 'rank' || header === 'turn') {
        return x;
      } else {
        return x.toFixed(4);
      }
    } else {
      return x;
    }
  }

  function dataRow(row) {
    return headers.map((x) => <div className='col cell'>{formatEntry(row[x], x)}</div>)
  }

  function dataRows(rows) {
    return rows.map((row, idx) => <div className='row' key={idx}>{dataRow(row)}</div>);
  }

  return (
    <>
      {headerRow && <div className='row header' key={-1}>{headerRow}</div>}
      {dataRows(output)}
    </>
  );
}

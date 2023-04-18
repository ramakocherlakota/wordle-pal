import React from 'react';
import PopupDoc from './PopupDoc';
import './guess-output-format.scss';

export default function GuessOutputFormat(data) {
  const { output, headers, headerLabels, headerDocs } = data;
  const headerRow = (headers && headers.map((x) => {
    const doc = headerDocs && (x in headerDocs) && headerDocs[x];
    const label = doc ? <PopupDoc label={headerLabels[x]} tooltip={doc} />
          : headerLabels[x];
    return (
      <th>{label}</th>
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
    return headers.map((x) => <td>{formatEntry(row[x], x)}</td>)
  }

  function dataRows(rows) {
    return rows.map((row, idx) => <tr key={idx}>{dataRow(row)}</tr>);
  }

  return (
    <table className="output" >
      {output && output.length > 0 && headerRow && <tr  key={-1}>{headerRow}</tr>}
      {dataRows(output)}
    </table>
  );
}

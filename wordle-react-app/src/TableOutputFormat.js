import React from 'react';
import PopupDoc from './PopupDoc';

export default function TableOutputFormat({ output, headers, headerLabels, headerDocs }) {
  const hasOutput = output && output.length > 0;

  const headerRow = (headers && headers.map((x,n) => {
    const doc = headerDocs && (x in headerDocs) && headerDocs[x];
    const label = doc ? <PopupDoc label={headerLabels[x]} tooltip={doc} />
          : headerLabels[x];
    return (
      <th key={n}>{label}</th>
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
    const className = row['compatible']  ? "highlight" : "";
    return headers.map((x, n) => <td key={n} className={className} >{formatEntry(row[x], x)}</td>)
  }

  function dataRows(rows) {
    return rows.map((row, idx) => <tr key={idx}>{dataRow(row)}</tr>);
  }

  return (
    <table className="output" >
      <thead>
        {hasOutput && headerRow && <tr  key={-1}>{headerRow}</tr>}
      </thead>
      <tbody>
        {dataRows(output)}
      </tbody>
    </table>
  );
}

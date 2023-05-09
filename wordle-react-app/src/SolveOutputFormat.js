import React from 'react';
import TableOutputFormat from './TableOutputFormat';

export default function SolveOutputFormat(data) {
  const { output, headers, headerLabels, headerDocs } = data;

  return <TableOutputFormat output={output} headers={headers}
                            headerLabels={headerLabels} headerDocs={headerDocs} />
}

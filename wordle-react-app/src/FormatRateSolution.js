import React from 'react';

export default function FormatRateSolution(data) {
  function union_lists(lists) {
    return lists.reduce((acc, list) => {
      if (list.length > acc.length) {
        return list;
      } else {
        return acc;
      }
    }, []);
  }

  function table_row(guess, targets, by_target) {
    //    const row_data = Object.values(by_target).map(records => records.filter(record => record.guess === guess));
    const row_data = targets.map(target => {
      const rows_for_target = by_target[target];
      const rows_for_target_with_guess = rows_for_target.filter(record => record.guess === guess);
      if (rows_for_target_with_guess.length > 0) {
        return rows_for_target_with_guess[0];
      } else {
        return null;
      }
    })
    const filling = row_data.map(cell => {
      return 'score' in cell
        ? <td>{cell.score}</td>
        : <td />;
    });

    return (
      <tr key={guess} >
        {filling}
      </tr>
    );
//    return (
//      <div key={guess} className='row'>
//        {
//        } 
//     </div>
//    );
  }

  if (data.output && typeof data.output === 'object' && 'by_target' in data.output ) {
    const targets = Object.keys(data.output.by_target);
    const guesses = union_lists(Object.values(data.output.by_target).map(records => records.map(record=>record.guess)))
    const rows = guesses.map(guess => table_row(guess, targets, data.output.by_target));
    return (
      <table>
        {rows}
      </table>
    );
  }
}

import React from 'react';
import { LuckEmoji } from './App';
import PopupDoc from './PopupDoc';
import './luck-output-format.scss';

export default function LuckOutputFormat({output, headers, headerLabels, hederDocs}) {
  function union_lists(lists) {
    return lists.reduce((acc, list) => {
      if (list.length > acc.length) {
        return list;
      } else {
        return acc;
      }
    }, []);
  }

  function formatCell(cell) {
    return (
      <div>
        Remaining Answers Before Guess: {cell.remaining_answers_prior}
        <br/>
        Remaining Answers After Guess: {cell.remaining_answers_post}
        <br/>
        Uncerttainty Before Guess: {cell.uncertainty_prior.toFixed(2)}
        <br/>
        Expected Uncertainty After Guess: {cell.exp_uncertainty_post.toFixed(2)}
        <br/>
        Uncerttainty After Guess: {cell.uncertainty_post.toFixed(2)}
        <br/>
        Luck: {cell.luck.toFixed(2)}
      </div>
    );
  }

  function table_row(guess, targets, by_target, totals) {
    const row_data = targets.map(target => {
      const rows_for_target = by_target[target];
      const rows_for_target_with_guess = rows_for_target.filter(record => record.guess === guess);
      if (rows_for_target_with_guess.length > 0) {
        return rows_for_target_with_guess[0];
      } else {
        return null;
      }
    })
    const row_data_with_totals = targets.length > 1
          ? row_data.concat(totals.filter(record => record.guess === guess)
                            .map(record => {
                              record.score = "";
                              return record;
                            }))
          : row_data;
    const scoreCells = row_data_with_totals.map(cell => {
      if (cell) {
        return 'score' in cell
          ? <td className='score-cell'>
              <PopupDoc label=<div className='luck-bits'>{cell.luck.toFixed(2)}{LuckEmoji()}</div>
                doc={formatCell(cell)} >
                <div>{cell.score.toUpperCase()}</div>
              </PopupDoc>
            </td>
           : <td/>;
        } else {
          return <td/>;
        }
    });

    return (
      <tr>
        <td>{guess}</td>
        {scoreCells}
        <td>anchors go here</td>
      </tr>
    );
  }

  if (output && typeof output === 'object' && 'by_target' in output ) {
    const targets = Object.keys(output.by_target);
    const guesses = union_lists(Object.values(output.by_target).map(records => records.map(record=>record.guess)))
    const header_row = headers.map(x => <th className='luck-header'>{headerLabels[x]}</th>)
    const rows = guesses.map(guess => table_row(guess, targets, output.by_target, output.totals));
    return (
      <center>
      <table className='luck-table'>
        <tr>{header_row}</tr>
        {rows}
      </table>
      </center>
    );
  }
}

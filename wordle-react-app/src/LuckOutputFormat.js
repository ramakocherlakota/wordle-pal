import React from 'react';
import PopupDoc from './PopupDoc';

export default function LuckOutputFormat(data) {
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
      const anchors = "anchors!";
      return 'score' in cell
        ? <>
            <div className='col'>
              <strong>{cell.guess}</strong>
            </div>
            <div className='col'></div>
            <PopupDoc doc={formatCell(cell)} 
              label={cell.score}
            />
            <div className='col'>
              {anchors}
            </div>
          </>
        : <div />;
    });

    return (
      <div className='row' key={guess} >
        {filling}
      </div>
    );
  }

  function getHeaderRow(targets) {
    return (
      <div className='row'>
        <div className='col'/>
        {targets.map(target => <div className='col'><strong>{target}</strong></div>)}
        <div className='col'>Buttons</div>
      </div>
    );
  }

  if (data.output && typeof data.output === 'object' && 'by_target' in data.output ) {
    const targets = Object.keys(data.output.by_target);
    const guesses = union_lists(Object.values(data.output.by_target).map(records => records.map(record=>record.guess)))
    const header_row = getHeaderRow(targets);
    const rows = guesses.map(guess => table_row(guess, targets, data.output.by_target));
    return (
      <>
        {header_row}
        {rows}
      </>
    );
  }
}

/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { LuckEmoji, RemainingEmoji, GuessEmoji } from './util/Emojis';
import PopupDoc from './PopupDoc';
import './luck-output-format.scss';
import { listWithAdjustedLength } from './util/Util';

export default function LuckOutputFormat({output, headers, headerLabels, hederDocs, setPane, setScoreLists, setGlobalGuesses, globalGuessCount, targetCount}) {
  function union_lists(lists) {
    return lists.reduce((acc, list) => {
      if (list.length > acc.length) {
        return list;
      } else {
        return acc;
      }
    }, []);
  }

  function formatLuck(luck) {
    return (luck > 0 ? "+" : "") + luck.toFixed(2);
  }

  function formatCell(cell) {
    if ("TOTAL" in cell) {
      return (
        <div>
          Uncertainty Before Guess: {cell.uncertainty_prior.toFixed(2)}
          <br/>
          Expected Uncertainty After Guess: {cell.exp_uncertainty_post.toFixed(2)}
          <br/>
          Uncertainty After Guess: {cell.uncertainty_post.toFixed(2)}
          <br/>
          Luck: {formatLuck(cell.luck)}
        </div>
      );
    } else {
      return (
        <div>
          Remaining Answers Before Guess: {cell.remaining_answers_prior}
          <br/>
          Remaining Answers After Guess: {cell.remaining_answers_post}
          <br/>
          Uncertainty Before Guess: {cell.uncertainty_prior.toFixed(2)}
          <br/>
          Expected Uncertainty After Guess: {cell.exp_uncertainty_post.toFixed(2)}
          <br/>
          Uncertainty After Guess: {cell.uncertainty_post.toFixed(2)}
          <br/>
          Luck: {formatLuck(cell.luck)}
        </div>
      );
    }
  }

  function extractGuesses(n) {
    const all_guesses = union_lists(Object.values(output.by_target).map(records => records.map(record=>record.guess)))
    if (n) {
      return listWithAdjustedLength(all_guesses.slice(0, n), globalGuessCount);
    } else {
      return listWithAdjustedLength(all_guesses, globalGuessCount);
    }
  }

  function extractScoreLists(n) {
    const targets = Object.keys(output.by_target);
    const score_lists = targets.map(target => {
      const rows_for_target = output.by_target[target];
      return rows_for_target.slice(0, n).map((row) => {
        return row.score;
      });
    });
    return score_lists;
  }

  function gotoPane(pane, n) {
    return function() {
      setGlobalGuesses(extractGuesses(n));
      setScoreLists(extractScoreLists(n));
      setPane(pane);
    }
  }    

  function links(n) {
    return <>
             <a href="#" className='pane-link' onClick={gotoPane('remaining', n)}>{RemainingEmoji()}</a>
             <a href="#" className='pane-link' onClick={gotoPane('guess', n)}>{GuessEmoji()}</a>
           </>;
  }

  function table_row(guess, n, targets, by_target, totals) {
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
                              record.TOTAL = 1;
                              return record;
                            }))
          : row_data;
    const scoreCells = row_data_with_totals.map(cell => {
      if (cell) {
        const cellLabel = (
          <div className='cell-label'>
            <div className='luck-score'>
              {cell.score.toUpperCase()}
            </div>
            <div className='luck-bits'>
              {formatLuck(cell.luck)}{LuckEmoji()}
            </div>
          </div>
        );
        return 'score' in cell
          ? <td className='score-cell'>
              <PopupDoc label={cellLabel}>
                <div>{formatCell(cell)}</div>
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
        <td>{links(n+1)}</td>
      </tr>
    );
  }

  function headerLabelsWithDocs(x) {
    if (x === 'guess') {
      return <div/>;
    }
    return (
      headerLabels[x]
      );
    }
      
    const linksHeader =
      <PopupDoc tooltip=
        <div>
          Click on the crescent moon to see the list of remaining possible answers and the light bulb for a hint on good next guesses at that point in the puzzle.
        </div>
      >Links</PopupDoc>;

  if (output && typeof output === 'object' && 'by_target' in output ) {
    const targets = Object.keys(output.by_target);
    const guesses = extractGuesses();
    const headerRow = headers.map(x => <th className='luck-header'>{headerLabelsWithDocs(x)}</th>);
    const headerRowWithTotals = targets.length > 1
          ? headerRow.concat(<th className='luck-header'>Totals</th>)
          : headerRow;
    const headerRowWithLinks = headerRowWithTotals.concat(<th className='luck-header'>{linksHeader}</th>);
    const rows = guesses.map((guess, n) => table_row(guess, n, targets, output.by_target, output.totals));
    return (
      <center>
      <table className='luck-table'>
        <tr>{headerRowWithLinks}</tr>
        {rows}
      </table>
      </center>
    );
  }
}

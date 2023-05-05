import React, {useState, useEffect} from 'react';
import PopupDoc from './PopupDoc';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import './guess-output-format.scss';


export default function GuessOutputFormat(data) {
  const { output, headers, headerLabels, headerDocs } = data;
  const [filteredOutput, setFilteredOutput] = useState(output);
  const [guessFilter, setGuessFilter] = useState("");
  const [compatibleFilter, setCompatibleFilter] = useState(false);

  useEffect(() => {
    const filteredByGuess = output.filter(record => record.guess.includes(guessFilter.toLowerCase()));
    if (compatibleFilter) {
      setFilteredOutput(filteredByGuess.filter(record => record.compatible));
    } else {
      setFilteredOutput(filteredByGuess);
    }
  }, [compatibleFilter, guessFilter, output]);

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

  const onInputChange = (e) => setGuessFilter(e.target.value);
  const guessFilterInput = <Input id="filter-input"  onChange={onInputChange} />;
  const onSwitchChange = (e) => setCompatibleFilter(!compatibleFilter);
  const compatibleSwitch = <Switch checked={compatibleFilter} onChange={onSwitchChange} />;

  const hasOutput = filteredOutput && filteredOutput.length > 0;
  const filterBox = (
    <div className="filters">
      <div className="filter-title">
        Filter Output:
      </div>
      <div className="guess-input-filter">
        <FormControl>
          <InputLabel htmlFor="filter-input">By Guess</InputLabel>
          {guessFilterInput}
        </FormControl>
      </div>
      <div className="compatible-switch">
        <FormControlLabel control={compatibleSwitch} label="By Compatible?" />
      </div>
    </div>
  );

  return (
    <>
      {output && output.length > 0 && filterBox}
      <table className="output" >
        <thead>
          {hasOutput && headerRow && <tr  key={-1}>{headerRow}</tr>}
        </thead>
        <tbody>
          {dataRows(filteredOutput)}
        </tbody>
      </table>
    </>
  );
}

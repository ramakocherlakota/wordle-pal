import React, {useState, useEffect} from 'react';
import TableOutputFormat from './TableOutputFormat';
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


  const onInputChange = (e) => setGuessFilter(e.target.value);
  const guessFilterInput = <Input id="filter-input"  onChange={onInputChange} />;
  const onSwitchChange = (e) => setCompatibleFilter(!compatibleFilter);
  const compatibleSwitch = <Switch checked={compatibleFilter} onChange={onSwitchChange} />;

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
      <TableOutputFormat output={filteredOutput} headers={headers}
                         headerLabels={headerLabels} headerDocs={headerDocs} />
    </>
  );
}

import React, {useState} from 'react';
import QueryGuessScores from './QueryGuessScores';
import HardModeRow from './HardModeRow';
import NumberInput from './NumberInput';

export default function Guess({guesses, setGuesses, scoreLists, setScoreLists, hardMode, setHardMode}) {
    const [guessCount, setGuessCount] = useState(5);
    const headers = ["guess", "uncertainty_before_guess", "expected_uncertainty_after_guess", "compatible"];
    const headerLabels = {
        guess : "Guess",
        uncertainty_before_guess : "Prior Uncertainty",
        expected_uncertainty_after_guess : "Expected Uncertainty",
        compatible: "Hard Mode Compatible"
    }
    return (
        <>
            <QueryGuessScores operation="qguess" headers={ headers } headerLabels={headerLabels} guesses={guesses} setGuesses={setGuesses} scoreLists={scoreLists} setScoreLists={setScoreLists} guessCount={guessCount} hardMode={hardMode} >
              <HardModeRow hardMode={hardMode} setHardMode={setHardMode} />
              <div className='row'>
                <div className='col' align='right'>Guess Count</div>
                <div className='col' align='left'>
                  <NumberInput maxValue={2315} minValue={1} value={guessCount} setValue={setGuessCount} />
                </div>
              </div>
            </QueryGuessScores>
        </>
    );
}

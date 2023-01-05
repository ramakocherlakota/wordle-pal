import React, {useState} from 'react';
import QueryGuessScores from './QueryGuessScores';
import HardModeRow from './HardModeRow';
import NumberInput from './NumberInput';
import PopupDoc from './PopupDoc';

export default function Guess({guesses, setGuesses, setGuessCount, scoreLists, setScoreLists, hardMode, setHardMode, targetCount}) {
    const [bestGuessCount, setBestGuessCount] = useState(5);
    const headers = ["rank", "guess", "uncertainty_before_guess", "expected_uncertainty_after_guess", "compatible"];
    const headerLabels = {
        rank : "Rank",
        guess : "Guess",
        uncertainty_before_guess : "Prior Uncertainty",
        expected_uncertainty_after_guess : "Expected Uncertainty",
        compatible: "Hard Mode Compatible"
    }
    return (
        <>
            <QueryGuessScores operation="qguess" headers={ headers } headerLabels={headerLabels} guesses={guesses} setGuesses={setGuesses} setGuessCount={setGuessCount} scoreLists={scoreLists} setScoreLists={setScoreLists} bestGuessCount={bestGuessCount} hardMode={hardMode} targetCount={targetCount} >
              <HardModeRow hardMode={hardMode} setHardMode={setHardMode} />
              <div className='row'>
                <div className='col' align='right'>
                  <PopupDoc doc=<div>
                                  How many "best guesses" do you want returned?  Must be a number between 1 and 2315.
                                </div> >
                    Guess Count
                  </PopupDoc>
                </div>
                <div className='col' align='left'>
                  <NumberInput maxValue={2315} minValue={1} value={bestGuessCount} setValue={setBestGuessCount} />
                </div>
              </div>
            </QueryGuessScores>
        </>
    );
}

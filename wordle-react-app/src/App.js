import React, {useState, useEffect} from 'react';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Guess from './Guess';
import Remainder from './Remainder';
import Solve from './Solve';
import Luck from './Luck';
import PopupDoc from './PopupDoc';
import NumberInput from './NumberInput';
import { listWithAdjustedLength, listOfEmptyStrings } from './Util';
import './App.scss';

export function RemainingEmoji() {
  return String.fromCodePoint(0x1F319);  // crescent moon
}

export function LuckEmoji() {
  return String.fromCodePoint(0x1F340);  // clover
}

export function GuessEmoji() {
  return String.fromCodePoint(0x1F4A1);  // light bulb
}

export function SolveEmoji() {
  return String.fromCodePoint(0x1F3C1);  // checkered flag
}

export default function App() {
  const [ allGuesses, setAllGuesses ] = useState(false); // include all Wordle guesses or just the answers in guess lists?
  const [ dimensions, setDimensions ] = useState({targets: 1, guesses: 1});
  const [ guesses, setGuesses ] = useState([""]);
  const [ scoreLists, setScoreLists ] = useState([[""]]);
  const [ hardMode, setHardMode ] = useState(false)
  const [ targets, setTargets ] = useState(listOfEmptyStrings(1));

  const luckTitle = <PopupDoc doc=
      <div>
        Select the target words and the guesses you made and click Go to get a rating of where you were lucky or unlucky in your guessing.
      </div>
    >
      {LuckEmoji()} Luck
    </PopupDoc>;

  const remainingTitle = <PopupDoc doc=
    <div>
      Click on the Go button to return a list of words (for each of the target words) compatible with what guesses and scores have been selected.
    </div> 
    >
      {RemainingEmoji()} Remaining
    </PopupDoc>;

  const bestGuessTitle = <PopupDoc doc=
    <div>
      Click on the Go button to return a list of the best next guesses for your Wordle / Quordle, ranked from the best down.
    </div> 
    >
      {GuessEmoji()} Guesses
    </PopupDoc>;

  const solveTitle = <PopupDoc doc=
    <div>
      Click on the Go button to have Wordle Pal solve the target word(s) you have set for it, starting from your favorite start words.
    </div> 
    >
      {SolveEmoji()} Solve
    </PopupDoc>;


  useEffect(() => {
    setGuesses((gs) => listWithAdjustedLength(gs, dimensions.guesses, () => ""))
    setScoreLists((sLists) => {
      const adjustedForTargetCount = listWithAdjustedLength(sLists, dimensions.targets, () => [[""]]);
      return adjustedForTargetCount.map((scoreList) => listWithAdjustedLength(scoreList, dimensions.guesses, () => [""]));
    });
  }, [dimensions]);

  function setTargetCount(targetCountUpdater) {
    if (typeof targetCountUpdater === 'function') {
      setDimensions((ds) => {
        return {
          guesses: ds.guesses,
          targets: targetCountUpdater(ds.targets)
        }
      });
    } else {
      setDimensions((ds) => {
        return {
          guesses: ds.guesses,
          targets: targetCountUpdater
        }
      });
    }
  }          

  function setGuessCount(guessCountUpdater) {
    if (typeof guessCountUpdater === 'function') {
      setDimensions((ds) => {
        return {
          targets: ds.targets,
          guesses: guessCountUpdater(ds.guesses)
        }
      });
    } else {
      setDimensions((ds) => {
        return {
          targets: ds.targets,
          guesses: guessCountUpdater
        }
      });
    }
  }          

  function targetCount() {
    return dimensions.targets;
  }

  return (
    <div className='app'>
      <div className='row header'>
        <div className='col' align='left'>
          <h2>Wordle Pal</h2>
        </div>
        <div className='col' align='right'>
          <PopupDoc 
            label=<h4>Help?</h4>
            doc=<div>
                Wordle Pal is an app to help you understand <a href="https://www.nytimes.com/games/wordle/index.html" rel="noreferrer" target="_blank">Wordle</a> (and its cousin, <a rel="noreferrer" href="https://www.quordle.com/#/" target="_blank">Quordle</a>) and hopefully to help you play better.  There are three modes, for getting the list of remaining possibilities, for getting what Wordle Pal thinks is the best next guess, or for having it solve a word.
                  <br/><br/>
                You'll need to be patient!  These operations take a long time, often minutes to complete.  
                <br/><br/>Click on the handy question marks for inline docs.</div> />
          <PopupDoc 
            label=<h5>How does it work?</h5>
            doc=<div>Wordle Pal uses a branch of mathematics called information theory to do its work.  The basic idea is that the best guess at any point is the one that minimizes the expected uncertainty after you make your guess and get your score back.  For more information, check out the <a target="_blank" href="slides.pdf" rel="noreferrer">slides from a presentation</a> or else <a target="_blank" rel="noreferrer" href="https://github.com/ramakocherlakota/wordle-level-up-2022">the code</a>.<br/><br/>
If you have thoughts or questions, feel free to email me at <a href="mailto:rama.kocherlakota@gmail.com">rama.kocherlakota@gmail.com</a></div> />
        </div>
      </div>
      <div className='row target-word'>
        <div className='col' align='right'>
          <PopupDoc doc=<div>Quordle is just like Wordle except you try to guess four words at the same time - many of us feel that is a better, less chancy game than Wordle.  Target Word Count allows you to specify how many words you're solving at the same time - Wordle is 1, Quordle is 4 but there's nothing special about those.<br/><br/>High values here will slow things down so you'll need extra patience</div> >
            Target Word Count
          </PopupDoc>
        </div>
        <div className='col' align='center'>
          <NumberInput value={targetCount()} setValue={setTargetCount} minValue={1} />
        </div>
        <div align='left' className='col'>
          {targetCount() === 1 && "Classic Wordle"}
          {targetCount() === 4 && "Quordle"}
        </div>
      </div>
      <Tabs className="mb-3" justify>
        <Tab eventKey="luck" title={luckTitle} >
          <Luck allGuesses={allGuesses} setAllGuesses={setAllGuesses} guesses={guesses} setGuesses={setGuesses} setGuessCount={setGuessCount} scoreLists={scoreLists} setScoreLists={setScoreLists} hardMode={hardMode} setHardMode={setHardMode} targetCount={targetCount()} setTargetCount={setTargetCount} targets={targets} setTargets={setTargets} />
        </Tab>
        <Tab eventKey="remainder" title={remainingTitle} >
          <Remainder allGuesses={allGuesses} setAllGuesses={setAllGuesses} guesses={guesses} setGuesses={setGuesses} setGuessCount={setGuessCount} scoreLists={scoreLists} setScoreLists={setScoreLists} hardMode={hardMode} setHardMode={setHardMode} targetCount={targetCount()} />
        </Tab>
        <Tab eventKey="guess" title={bestGuessTitle} >
          <Guess allGuesses={allGuesses} setAllGuesses={setAllGuesses} guesses={guesses} setGuesses={setGuesses} setGuessCount={setGuessCount} scoreLists={scoreLists} setScoreLists={setScoreLists} hardMode={hardMode} setHardMode={setHardMode} targetCount={targetCount()} />
        </Tab>
        <Tab eventKey="solve" title={solveTitle}>
          <Solve allGuesses={allGuesses} setAllGuesses={setAllGuesses} hardMode={hardMode} setHardMode={setHardMode} targetCount={targetCount()} setTargetCount={setTargetCount} targets={targets} setTargets={setTargets} />
        </Tab>
      </Tabs>
    </div>
  );
}


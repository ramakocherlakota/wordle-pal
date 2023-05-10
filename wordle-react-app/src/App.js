/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useState, useEffect} from 'react';

import './App.scss';

import {
  PalEmoji,
  LuckEmoji,
  RemainingEmoji,
  GuessEmoji,
  QuestionEmoji,
  SolveEmoji
} from './util/Emojis';

import PopupDoc from './PopupDoc';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';

import Settings from './Settings';
import { listWithAdjustedLength, listOfEmptyStrings } from './util/Util';
import Guess from './Guess';
import Remaining from './Remaining';
import Solve from './Solve';
import Luck from './Luck';

export default function App() {
  const [ allGuesses, setAllGuesses ] = useState(false); // include all Wordle guesses or just the answers in guess lists?
  const [ puzzleMode, setPuzzleMode ] = useState("Wordle");
  const [ scoreLists, setScoreLists ] = useState([[""]]);
  const [ hardMode, setHardMode ] = useState(false)

  const [ targets, setTargets ] = useState(listOfEmptyStrings(1));
  const [ guesses, setGuesses ] = useState([""]);

  const [ pane, setPane ] = useState("luck");

  useEffect(() => {
    const adjustLengths = (gCount, tCount) => {
      setGuesses((g) => listWithAdjustedLength(g, gCount));
      setTargets((t) => listWithAdjustedLength(t, tCount));

      // there should be tCount scoreLists, each with a length of gCount
      const newScoreLists = listWithAdjustedLength([], tCount, () => [listOfEmptyStrings(gCount)]);
      setScoreLists(newScoreLists)
    }

    if (puzzleMode === "Wordle") {
      adjustLengths(6, 1);
    } else {
      adjustLengths(9 + (puzzleMode === "Sequence" ? 1 : 0), 4);
    }
  }, [puzzleMode]);

  function tabLabelWithIcon(label, icon, tooltip) {
    return (
      <div className="tab-heading">
        <Tooltip title={tooltip}>
          <div className="tab">
            <div className="tab-icon">
              {icon}
            </div>
            <div className="tab-label">
              {label}
            </div>
          </div>
        </Tooltip>
      </div>
    );
  }

  const luckLabel = tabLabelWithIcon("Luck", LuckEmoji(), "How lucky were your guesses?");
  const remainingLabel = tabLabelWithIcon("Remaining", RemainingEmoji(), "What possibilities remain?");
  const guessLabel = tabLabelWithIcon("Guess", GuessEmoji(), "What would be your best next guess?");
  const solveLabel = tabLabelWithIcon("Solve", SolveEmoji(), "What would be the best path to solving the puzzle?");;


  const luckPanel = <Luck allGuesses={allGuesses} hardMode={hardMode} targets={targets} setTargets={setTargets} setPane={setPane} setGlobalGuesses={setGuesses} globalGuessCount={guesses.length} setScoreLists={setScoreLists}  sequence={puzzleMode === "Sequence"} />;
  const remainingPanel = <Remaining allGuesses={allGuesses} guesses={guesses} setGuesses={setGuesses} scoreLists={scoreLists} setScoreLists={setScoreLists} hardMode={hardMode} targetCount={targets.length} sequence={puzzleMode === "Sequence"} />;
  const guessPanel = <Guess allGuesses={allGuesses} setAllGuesses={setAllGuesses} guesses={guesses} setGuesses={setGuesses} scoreLists={scoreLists} setScoreLists={setScoreLists} hardMode={hardMode} targetCount={targets.length} sequence={puzzleMode === "Sequence"} />;
  const solvePanel = <Solve allGuesses={allGuesses} hardMode={hardMode} setHardMode={setHardMode}  targets={targets} setTargets={setTargets} targetCount={targets.length} guesses={guesses} setGuesses={setGuesses} sequence={puzzleMode === "Sequence"} />;

  const keyedTabPanels = {
    luck: luckPanel,
    remaining: remainingPanel,
    guess: guessPanel,
    solve: solvePanel
  };

  const tabPanels = Object.keys(keyedTabPanels).map((key) => {
    return (
      <div key={key} className={pane === key ? 'tab-panel' : 'tab-panel-hidden'}>
        {keyedTabPanels[key]}
      </div>
    );
  });

  const tabContext = (
    <TabContext value={pane} >
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <TabList value={pane} onChange={(evt, k)=>setPane(k)} >
          <Tab label={luckLabel} key="luck" value="luck" />
          <Tab label={remainingLabel} key="remaining" value="remaining" />
          <Tab label={guessLabel} key="guess" value="guess" />
          <Tab label={solveLabel} key="solve" value="solve" />
        </TabList>
      </Box>
      <TabPanel key="luck" value="luck"></TabPanel>
      <TabPanel key="remmaining" value="remaining"></TabPanel>
      <TabPanel key="guess" value="guess"></TabPanel>
      <TabPanel key="solve" value="solve"></TabPanel>
    </TabContext>
  );

  const helpText = (
    <div>
      Wordle Pal has four panels: Luck, Remaining, Guess and Solve.  
      <ul>
        <li><strong>Luck</strong>: Enter the target word and the guesses you made along the way to get there and Wordle Pal will give you its estimate of how lucky each guess was.  There are also links to the other panels so that you can see how things stood at each stage of your progress.</li>
        <li><strong>Remaining</strong>: Enter your guesses and the scores up to that point to find out what words are still possible answers.</li>
        <li><strong>Guess</strong>: Like Remaining, enter guesses and scores but this time you'll get a ranked list of the possible next guesses.  You can filter the results by typing partial words or only showing the guesses that actually might be solutions.</li>
        <li><strong>Solve</strong>: Enter the target word and a few guesses and let Wordle Pal take it from there, optimizing its guesses to solve the puzzle for you.</li>
      </ul>
      <p>
        <strong>Scores</strong> are entered using the MasterMind code of B (black peg) means a letter correct and in the correct place, W (white peg) is a letter correct but in the wrong place.
      </p>
      <p>
        Wordle Pal also knows how to play Quordle and Sequence - click on the Settings icon in the upper right corner of the screen to select the puzzle mode and also whether you want to play in Hard Mode (where all your guesses must be possible solutions) and also if you want to allow all possible guesses (of which there are about 12000) or only the guesses that are actually allowed Wordle solutions (of which there are 2315).
      </p>
    </div>
  );

  return (
    <div className='app'>
      <div className='header-row'>
        <div key="title" className="header-row-cell">
          <h3>
            Wordle Pal
          </h3>
        </div>
        <div key="pal" className="header-row-cell">
          <PopupDoc label={QuestionEmoji()} tooltip=<div className='tooltip-text'>How to use Wordle Pal</div> >
            {helpText}
          </PopupDoc>
          <Settings  hardMode={hardMode}
                     setHardMode={setHardMode}
                     puzzleMode={puzzleMode}
                     setPuzzleMode={setPuzzleMode}
                     allGuesses={allGuesses}
                     setAllGuesses={setAllGuesses}/>
        </div>
      </div>
      {tabContext}
      {tabPanels}
    </div>
  );
}




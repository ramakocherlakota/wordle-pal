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
  const [ quordle, setQuordle ] = useState(false);
  const [ sequence, setSequence ] = useState(false);
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

    if (!quordle) {
      adjustLengths(6, 1);
    } else {
      adjustLengths(9 + (sequence ? 1 : 0), 4);
    }
  }, [quordle, sequence]);

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


  const luckPanel = <Luck allGuesses={allGuesses} hardMode={hardMode} targets={targets} setTargets={setTargets} setPane={setPane} setGlobalGuesses={setGuesses} globalGuessCount={guesses.length} setScoreLists={setScoreLists}  sequence={sequence} />;
  const remainingPanel = <Remaining allGuesses={allGuesses} guesses={guesses} setGuesses={setGuesses} scoreLists={scoreLists} setScoreLists={setScoreLists} hardMode={hardMode} targetCount={targets.length} sequence={sequence} />;
  const guessPanel = <Guess allGuesses={allGuesses} setAllGuesses={setAllGuesses} guesses={guesses} setGuesses={setGuesses} scoreLists={scoreLists} setScoreLists={setScoreLists} hardMode={hardMode} targetCount={targets.length} sequence={sequence} />;
  const solvePanel = <Solve allGuesses={allGuesses} hardMode={hardMode} setHardMode={setHardMode}  targets={targets} setTargets={setTargets} targetCount={targets.length} guesses={guesses} setGuesses={setGuesses} sequence={sequence} />;

  const keyedTabPanels = {
    luck: luckPanel,
    remaining: remainingPanel,
    guess: guessPanel,
    solve: solvePanel
  };

  const tabPanels = Object.keys(keyedTabPanels).map((key) => {
    return (
      <div className={pane === key ? 'tab-panel' : 'tab-panel-hidden'}>
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

  return (
    <div className='app'>
      <div className='header-row'>
        <div className="header-row-cell">
          <h3>
            Wordle Pal
          </h3>
        </div>
        <div className="header-row-cell">
          <PopupDoc label={PalEmoji()} tooltip=<div className='tooltip-text'>How does it work?</div> >
            <div>
              How does Wordle Pal work?
            </div>
          </PopupDoc>
          <PopupDoc label={QuestionEmoji()} tooltip=<div className='tooltip-text'>How to use Wordle Pal</div> >
            <div>
              The first thing WordlePal will do for you is:
            </div>
          </PopupDoc>
        <Settings  hardMode={hardMode}
                   setHardMode={setHardMode}
                   quordle={quordle}
                   setQuordle={setQuordle}
                   sequence={sequence}
                   setSequence={setSequence}
                   allGuesses={allGuesses}
                   setAllGuesses={setAllGuesses}/>
        </div>
      </div>
      {tabContext}
      {tabPanels}
    </div>
  );
}


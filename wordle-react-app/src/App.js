import React, {useState, useEffect} from 'react';

import './App.scss';

import {
  LuckEmoji,
  RemainingEmoji,
  ResetEmoji,
  GuessEmoji,
  PalEmoji,
  QuestionEmoji,
  SolveEmoji,
  PracticeEmoji
} from './util/Emojis';

import PopupDoc from './PopupDoc';
import ModeDropDown from './ModeDropDown';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import Tabs from '@mui/material/Tabs';
import TabPanel from '@mui/lab/TabPanel';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import Practice from './Practice';
import Settings from './Settings';
import { jsonFromLS, listWithAdjustedLength, listOfEmptyStrings } from './util/Util';
import Guess from './Guess';
import Remaining from './Remaining';
import Solve from './Solve';
import Luck from './Luck';
import HelpText from './HelpText';

export default function App() {

  const queryParameters = new URLSearchParams(window.location.search);
  const clear  = queryParameters.get("clear");
  if (clear) {
    window.localStorage.clear();
  }
  
  /* from react-local-storage allGuesses */
  const [ allGuesses, setAllGuesses ] = useState(window.localStorage.getItem("allGuesses") === "true");
  useEffect(() => {
    window.localStorage.setItem("allGuesses", allGuesses);
  }, [allGuesses]);
  /* end from react-local-storage allGuesses */

  /* from react-local-storage hardMode */
  const [ hardMode, setHardMode ] = useState(window.localStorage.getItem("hardMode") === "true");
  useEffect(() => {
    window.localStorage.setItem("hardMode", hardMode);
  }, [hardMode]);
  /* end from react-local-storage hardMode */

  /* from react-local-storage showBW */
  const [ showBW, setShowBW ] = useState(window.localStorage.getItem("showBW") === "true");
  useEffect(() => {
    window.localStorage.setItem("showBW", showBW);
  }, [showBW]);
  /* end from react-local-storage showBW */

  /* from react-local-storage puzzleMode */
  const [ puzzleMode, setPuzzleMode ] = useState(window.localStorage.getItem("puzzleMode") || "Wordle");
  useEffect(() => {
    window.localStorage.setItem("puzzleMode", puzzleMode);
  }, [puzzleMode]);
  /* end from react-local-storage puzzleMode */

  /* from react-local-storage pane */
  const [ pane, setPane ] = useState(window.localStorage.getItem("pane") || "practice");
  useEffect(() => {
    window.localStorage.setItem("pane", pane);
  }, [pane]);
  /* end from react-local-storage pane */

  /* from react-local-storage scoreLists */
  const [ scoreLists, setScoreLists ] = useState(jsonFromLS("scoreLists", [[""]]));
  useEffect(() => {
    window.localStorage.setItem("scoreLists", JSON.stringify(scoreLists));
  }, [scoreLists]);
  /* end from react-local-storage scoreLists */

  /* from react-local-storage targets */
  const [ targets, setTargets ] = useState(jsonFromLS("targets", [""]));
  useEffect(() => {
    window.localStorage.setItem("targets", JSON.stringify(targets));
  }, [targets]);
  /* end from react-local-storage targets */
//  const [ targets, setTargets ] = useState(listOfEmptyStrings(1));
  
  /* from react-local-storage guesses */
  const [ guesses, setGuesses ] = useState(jsonFromLS("guesses", [""]));
  useEffect(() => {
    window.localStorage.setItem("guesses", JSON.stringify(guesses));
  }, [guesses]);
  /* end from react-local-storage guesses */
//  const [ guesses, setGuesses ] = useState([""]);

  /* from react-local-storage luckGuesses */
  const [ luckGuesses, setLuckGuesses ] = useState(jsonFromLS("luckGuesses", [""]
));
  useEffect(() => {
    window.localStorage.setItem("luckGuesses", JSON.stringify(luckGuesses));
  }, [luckGuesses]);
  /* end from react-local-storage luckGuesses */

  const maxGuessCounts = {
    Wordle: 6,
    Quordle: 9,
    Sequence: 10
  };

  const targetCounts = {
    Wordle: 1,
    Quordle: 4,
    Sequence: 4
  };

  function reset() {
    setScoreLists([[""]]);
    setTargets([""]);
    setGuesses([""]);
    setLuckGuesses([""]);
    adjustLengths();
  }

  function adjustLengths() {
    const gCount = maxGuessCounts[puzzleMode];
    const tCount = targetCounts[puzzleMode];
    setGuesses((g) => listWithAdjustedLength(g, gCount));
    setTargets((t) => listWithAdjustedLength(t, tCount));

    // there should be tCount scoreLists, each with a length of gCount
    setScoreLists((sls) => listWithAdjustedLength(sls, tCount, () => [listOfEmptyStrings(gCount)]));
  }

  useEffect(() => {
    adjustLengths( );
  }, [puzzleMode]); // eslint-disable-line

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

  const practiceLabel = tabLabelWithIcon("Practice", PracticeEmoji(), "Practice makes perfect!");
  const luckLabel = tabLabelWithIcon("Luck", LuckEmoji(), "How lucky were your guesses?");
  const remainingLabel = tabLabelWithIcon("Remaining", RemainingEmoji(), "What possibilities remain?");
  const guessLabel = tabLabelWithIcon("Guess", GuessEmoji(), "What would be your best next guess?");
  const solveLabel = tabLabelWithIcon("Solve", SolveEmoji(), "What would be the best path to solving the puzzle?");;

  const practicePanel = <Practice puzzleMode={puzzleMode} maxGuessCounts={maxGuessCounts} allGuesses={allGuesses} hardMode={hardMode} setPane={setPane} setGlobalGuesses={setLuckGuesses} globalGuessCount={guesses.length} setGlobalTargets={setTargets} targetCount={targetCounts[puzzleMode]} showBW={showBW} />;
  const luckPanel = <Luck luckGuesses={luckGuesses} setLuckGuesses={setLuckGuesses} allGuesses={allGuesses} hardMode={hardMode} targets={targets} setTargets={setTargets} setPane={setPane} setGlobalGuesses={setGuesses} globalGuessCount={guesses.length} setScoreLists={setScoreLists}  sequence={puzzleMode === "Sequence"} showBW={showBW} />;
  const remainingPanel = <Remaining allGuesses={allGuesses} guesses={guesses} setGuesses={setGuesses} scoreLists={scoreLists} setScoreLists={setScoreLists} hardMode={hardMode} targetCount={targets.length} sequence={puzzleMode === "Sequence"} showBW={showBW} />;
  const guessPanel = <Guess allGuesses={allGuesses} setAllGuesses={setAllGuesses} guesses={guesses} setGuesses={setGuesses} scoreLists={scoreLists} setScoreLists={setScoreLists} hardMode={hardMode} targetCount={targets.length} sequence={puzzleMode === "Sequence"} showBW={showBW} />;
  const solvePanel = <Solve allGuesses={allGuesses} hardMode={hardMode} setHardMode={setHardMode}  targets={targets} setTargets={setTargets} targetCount={targets.length} guesses={guesses} setGuesses={setGuesses} sequence={puzzleMode === "Sequence"} />;

  const keyedTabPanels = {
    practice: practicePanel,
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
        <Tabs value={pane} onChange={(evt, k)=>setPane(k)} variant="scrollable" scrollButtons="auto" >
          <Tab label={practiceLabel} key="practice" value="practice" />
          <Tab label={luckLabel} key="luck" value="luck" />
          <Tab label={remainingLabel} key="remaining" value="remaining" />
          <Tab label={guessLabel} key="guess" value="guess" />
          <Tab label={solveLabel} key="solve" value="solve" />
        </Tabs>
      </Box>
      <TabPanel key="luck" value="luck"></TabPanel>
      <TabPanel key="pracctice" value="pracctice"></TabPanel>
      <TabPanel key="remmaining" value="remaining"></TabPanel>
      <TabPanel key="guess" value="guess"></TabPanel>
      <TabPanel key="solve" value="solve"></TabPanel>
    </TabContext>
  );

  const helpText = HelpText();

  return (
    <div className='app'>
      <div className='header-row'>
        <div key="pal" className="header-row-cell">
          <div className='title'>
            {PalEmoji()} Wordle Pal
          </div>
        </div>
        <div key="header-buttons" className="header-row-cell">
          <ModeDropDown puzzleMode={puzzleMode} setPuzzleMode={setPuzzleMode}/>
          {pane !== 'practice' && 
           <PopupDoc label={ResetEmoji()} tooltip="Reset input" ok="OK" okAction={reset} labelClass="enlarge-emoji" >
             <div>
               Do you want to reset the targets, scores and guesses you've entered (for all the panes except Practice)?
             </div>
           </PopupDoc>
          }
          <Settings  hardMode={hardMode}
                     setHardMode={setHardMode}
                     showBW={showBW}
                     setShowBW={setShowBW}                     
                     allGuesses={allGuesses}
                     setAllGuesses={setAllGuesses}/>
          <PopupDoc label={QuestionEmoji()} tooltip=<div className='tooltip-text'>How to use Wordle Pal</div> >
            {helpText}
          </PopupDoc>
        </div>
      </div>
      {tabContext}
      {tabPanels}
    </div>
  );
}




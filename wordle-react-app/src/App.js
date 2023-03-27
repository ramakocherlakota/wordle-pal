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
  const [ scoreLists, setScoreLists ] = useState([[""]]);
  const [ hardMode, setHardMode ] = useState(false)

  const [ targets, setTargets ] = useState(listOfEmptyStrings(1));
  const [ guesses, setGuesses ] = useState([""]);

  const [ pane, setPane ] = useState("luck");

  useEffect(() => {
    const adjustLengths = (gCount, tCount) => {
      setGuesses((g) => listWithAdjustedLength(g, gCount));
      setTargets((t) => listWithAdjustedLength(t, tCount));
      setScoreLists((sls) => listWithAdjustedLength(sls, tCount, () => [[""]]));
    }

    if (!quordle) {
      adjustLengths(6, 1);
    } else {
      adjustLengths(9, 4);
    }
  }, [quordle]);

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


  const luckPanel = <Luck allGuesses={allGuesses} hardMode={hardMode} targets={targets} setTargets={setTargets} setPane={setPane} setGlobalGuesses={setGuesses} globalGuessCount={guesses.length} setScoreLists={setScoreLists}  />;
  const remainingPanel = <Remaining allGuesses={allGuesses} guesses={guesses} setGuesses={setGuesses} scoreLists={scoreLists} setScoreLists={setScoreLists} hardMode={hardMode} />;
  const guessPanel = <Guess allGuesses={allGuesses} setAllGuesses={setAllGuesses} guesses={guesses} setGuesses={setGuesses} scoreLists={scoreLists} setScoreLists={setScoreLists} hardMode={hardMode} />;
  const solvePanel = <Solve allGuesses={allGuesses} hardMode={hardMode} setHardMode={setHardMode}  targets={targets} setTargets={setTargets} />;

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
          <Tab label={luckLabel} value="luck" />
          <Tab label={remainingLabel} value="remaining" />
          <Tab label={guessLabel} value="guess" />
          <Tab label={solveLabel} value="solve" />
        </TabList>
      </Box>
      <TabPanel value="luck"></TabPanel>
      <TabPanel value="remaining"></TabPanel>
      <TabPanel value="guess"></TabPanel>
      <TabPanel value="solve"></TabPanel>
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
                   allGuesses={allGuesses}
                   setAllGuesses={setAllGuesses}/>
        </div>
      </div>
      {tabContext}
      {tabPanels}
    </div>
  );
    

//  return (
//    <div className='app'>
//      <div className='row header'>
//        <div className='col' align='left'>
//          <h2>Wordle Pal</h2>
//        </div>
//        <div className='col'>
//          <PopupDoc doc=<div>Quordle is just like Wordle except you try to guess four words at the same time - many of us feel that is a better, less chancy game than Wordle.  Target Word Count allows you to specify how many words you're solving at the same time - Wordle is 1, Quordle is 4 but there's nothing special about those.<br/><br/>High values here will slow things down so you'll need extra patience</div> >
//            <FormGroup>
//              <FormControlLabel control={<Switch  checked={targetCount() > 1} onChange={handleQuordleSwitch} />} label="Quordle" />
//            </FormGroup>
//          </PopupDoc>
//        </div>
//        <div className='col' align='right'>
//          <PopupDoc 
//            label=<h4>Help?</h4>
//            doc=<div>
//                Wordle Pal is an app to help you understand <a href="https://www.nytimes.com/games/wordle/index.html" rel="noreferrer" target="_blank">Wordle</a> (and its cousin, <a rel="noreferrer" href="https://www.quordle.com/#/" target="_blank">Quordle</a>) and hopefully to help you play better.  There are three modes, for getting the list of remaining possibilities, for getting what Wordle Pal thinks is the best next guess, or for having it solve a word.
//                  <br/><br/>
//                You'll need to be patient!  These operations take a long time, often minutes to complete.  
//                <br/><br/>Click on the handy question marks for inline docs.</div> />
//          <PopupDoc 
//            label=<h5>How does it work?</h5>
//            doc=<div>Wordle Pal uses a branch of mathematics called information theory to do its work.  The basic idea is that the best guess at any point is the one that minimizes the expected uncertainty after you make your guess and get your score back.  For more information, check out the <a target="_blank" href="slides.pdf" rel="noreferrer">slides from a presentation</a> or else <a target="_blank" rel="noreferrer" href="https://github.com/ramakocherlakota/wordle-level-up-2022">the code</a>.<br/><br/>
//If you have thoughts or questions, feel free to email me at <a href="mailto:rama.kocherlakota@gmail.com">rama.kocherlakota@gmail.com</a></div> />
//        </div>
//      </div>
//        <Tab eventKey="guess" title={bestGuessTitle} >
//
//        </Tab>
//        <Tab eventKey="solve" title={solveTitle}>
//        </Tab>
//      </Tabs>
//    </div>
//  );
}


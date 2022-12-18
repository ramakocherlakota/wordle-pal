import React from 'react';
import GuessScorePair from './GuessScorePair';
import GuessScorePairAdder from './GuessScorePairAdder';

import Container from 'react-bootstrap/Container';

export default function GuessScores({guessScores,  setGuessScores}) {
    /* okay these methods aren't creating deep copies, I don't think it matters */
    const getGuess = function(guessScore) {
        return guessScore['guess'];
    };

    const getScore = function(guessScore) {
        return guessScore['score'];
    };

    const replaceGuessScore = function(index, guess, score) {
        // copy guessStores to a new value and substitute @index with new value
        const newGuessScores = guessScores.map((guessScore, idx) => {
            if (idx !== index) {
                return guessScore;
            } else {
                return {'guess': guess, 'score' : score};
            }
        });
        setGuessScores(newGuessScores);
    };

    const setGuess = function(index) {
        return function(guess) {
            const score = getScore(guessScores[index]);
            replaceGuessScore(index, guess, score);
        }
    }

    const setScore = function(index) {
        return function(score) {
            const guess = getGuess(guessScores[index]);
            replaceGuessScore(index, guess, score);
        }
    };

    const deleter = function(index) {
        return function() {
            const newGuessScores = guessScores.filter((guessScore, idx) => {
                return idx !== index;
            });
            setGuessScores(newGuessScores);
        }
    };

    const adder = function() {
        const newGuessScores = guessScores.concat({guess:"", score:""});
        setGuessScores(newGuessScores);
    };

    return (
        <>
            <Container>
                {guessScores.map((guessScore, index) => 
                    <GuessScorePair key={index} score={getScore(guessScore)} guess={getGuess(guessScore)} setScore={setScore(index)} setGuess={setGuess(index)} deleter={deleter(index)} />
                )}
            </Container>
            <GuessScorePairAdder adder={adder} />
        </>
    );
}

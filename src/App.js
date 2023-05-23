import React, { useEffect, useState } from "react";
import Confetti from "react-confetti";

import Die from "./components/Die";

function App() {
  const [allDice, setDice] = useState(allNewDice());
  const [tenzies, setTenzies] = useState(false);
  const [countRolls, setCountRolls] = useState(0);
  const [highscoreRolls, setHighscoreRolls] = useState(
    localStorage.getItem("highscoreRolls")
  );
  const [highscoreTime, setHighscoreTime] = useState(
    localStorage.getItem("highscoreTime")
  );
  const [timeCount, setTimeCount] = useState(0);
  const [freezeTime, setFreezeTime] = useState();
  const [firstDieClicked, setFirstDieClicked] = useState(false);

  function dieClicked() {
    return !allDice.every((d) => !d.isHeld);
  }

  if (dieClicked() && !firstDieClicked) {
    setTimeCount(0);
    setFirstDieClicked(true);
  }

  useEffect(() => {
    const timer = setInterval(() => setTimeCount(timeCount + 1), 1000);
    return () => clearInterval(timer);
  }, [timeCount]);

  useEffect(() => {
    const values = allDice.map((die) => die.value);
    const helded = allDice.map((die) => die.isHeld);
    if (
      values.every((val) => val === values[0]) &&
      helded.every((val) => val === helded[0])
    ) {
      setTenzies(true);
      setFreezeTime(timeCount);

      if (!highscoreRolls || countRolls < highscoreRolls) {
        localStorage.setItem("highscoreRolls", countRolls);
        setHighscoreRolls(countRolls);
      }
      if (!highscoreTime || timeCount < highscoreTime) {
        localStorage.setItem("highscoreTime", timeCount);
        setHighscoreTime(timeCount);
      }
    }
  }, [allDice]);

  function allNewDice() {
    const newDice = [];

    for (let i = 0; i < 10; i++) {
      newDice.push({
        id: i,
        value: Math.ceil(Math.random() * 6),
        isHeld: false,
      });
    }
    return newDice;
  }

  function rollDice() {
    setDice((prevDice) =>
      prevDice.map((die) => {
        return die.isHeld
          ? die
          : { ...die, value: Math.ceil(Math.random() * 6) };
      })
    );
    setCountRolls((prev) => prev + 1);
  }

  function holdDice(id) {
    const prevDice = [...allDice];

    prevDice.map((d) => (d.id === id ? (d.isHeld = !d.isHeld) : d));
    setDice(prevDice);
  }

  function endGame() {
    setDice(allNewDice);
    setTenzies(false);
    setCountRolls(0);
    setTimeCount(0);
  }

  const diceElements = allDice.map((dice) => {
    return (
      <Die
        key={dice.id}
        id={dice.id}
        value={dice.value}
        isHeld={dice.isHeld}
        holdDice={holdDice}
      />
    );
  });

  return (
    <div>
      <main>
        <h1 className="title">Dice-Game</h1>
        <p className="instructions">
          Roll until all dice are the same. Click each die to freeze it at its
          current value between rolls.
        </p>
        <div className="dice-container">{diceElements}</div>
        {!tenzies ? (
          <button className="roll-dice" onClick={rollDice}>
            Roll
          </button>
        ) : (
          <div>
            <button className="roll-dice" onClick={endGame}>
              New Game
            </button>
            <Confetti width={window.innerWidth} height={window.innerHeight} />
          </div>
        )}

        {highscoreRolls && <h3>Least Rolls: {highscoreRolls}</h3>}
        {highscoreTime && <h3>Fastest Round: {highscoreTime} seconds</h3>}
        <h3>Rolls: {countRolls}</h3>
        <h3>Timer: {tenzies ? freezeTime : dieClicked() ? timeCount : "0"}</h3>
      </main>
    </div>
  );
}

export default App;

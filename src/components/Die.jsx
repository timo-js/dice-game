import React from "react";

function Die({ value, isHeld, id, holdDice }) {
  const styles = {
    backgroundColor: isHeld ? "#829ab1" : "white",
  };

  const dotElements = renderDots(value);

  function renderDots(value) {
    const dots = [];
    for (let i = 0; i < value; i++) {
      dots.push(<span className="dot"></span>);
    }
    return dots;
  }

  return (
    <div
      className={`die-face face-${value}`}
      style={styles}
      onClick={() => holdDice(id)}
    >
      {dotElements}
    </div>
  );
}

export default Die;

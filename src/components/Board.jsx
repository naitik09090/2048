import React, { useState } from "react";
import Tile from "./Tile";
import Cell from "./Cell";
import { Board } from "../helper";
import useEvent from "../hooks/useEvent";
import GameOverlay from "./GameOverlay";

const BoardView = () => {
  const [board, setBoard] = useState(new Board());

  // Touch state
  const [touchStart, setTouchStart] = useState({ x: 0, y: 0 });


  // Handle keyboard inputs
  const handleKeyDown = (event) => {
    if (board.hasWon()) return;

    if (event.keyCode >= 37 && event.keyCode <= 40) {
      event.preventDefault(); // Prevent scrolling with keys
      let direction = event.keyCode - 37;
      move(direction);
    }
  };

  // Helper function to execute move
  const move = (direction) => {
    let boardClone = Object.assign(
      Object.create(Object.getPrototypeOf(board)),
      board
    );
    let newBoard = boardClone.move(direction);
    setBoard(newBoard);
  };

  // Handle touch start
  const handleTouchStart = (e) => {
    setTouchStart({
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    });
  };

  // Handle touch end and calculate direction
  const handleTouchEnd = (e) => {
    if (board.hasWon()) return;

    if (!touchStart.x || !touchStart.y) return;

    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;

    const diffX = touchStart.x - touchEndX;
    const diffY = touchStart.y - touchEndY;
    const minSwipeDistance = 30; // Minimum distance to be considered a swipe

    // Check if horizontal swipe is greater than vertical swipe
    if (Math.abs(diffX) > Math.abs(diffY)) {
      if (Math.abs(diffX) > minSwipeDistance) {
        if (diffX > 0) {
          move(0); // Left (Matches keyCode 37)
        } else {
          move(2); // Right (Matches keyCode 39)
        }
      }
    } else {
      // Vertical swipe
      if (Math.abs(diffY) > minSwipeDistance) {
        if (diffY > 0) {
          move(1); // Up (Matches keyCode 38)
        } else {
          move(3); // Down (Matches keyCode 40)
        }
      }
    }

    // Reset values
    setTouchStart({ x: 0, y: 0 });

  };

  useEvent("keydown", handleKeyDown);

  // Add touch listeners to the window or board
  useEvent("touchstart", handleTouchStart, { passive: false });
  useEvent("touchend", handleTouchEnd);

  const cells = board.cells.map((row, rowIndex) => {
    return (
      <div key={rowIndex} className="board-row">
        {row.map((col, colIndex) => {
          return <Cell key={rowIndex * board.size + colIndex} />;
        })}
      </div>
    );
  });

  const tiles = board.tiles
    .filter((tile) => tile.value !== 0)
    .map((tile, index) => {
      return <Tile tile={tile} key={index} />;
    });

  const resetGame = () => {
    setBoard(new Board());
  };

  return (
    <div
      className="game-container"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="details-box">
        <div>
          <h1>2048</h1>
        </div>
        <div className="resetButton" onClick={resetGame}>
          New Game
        </div>
        <div className="score-box">
          <div className="score-header">SCORE</div>
          <div>{board.score}</div>
        </div>
      </div>
      <div className="board">
        {cells}
        {tiles}
        <GameOverlay onRestart={resetGame} board={board} />
      </div>
    </div>
  );
};

export default BoardView;

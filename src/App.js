import React, { useState, useEffect } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import './App.css';

const colors = ['red', 'blue', 'green', 'yellow', 'orange']; // Available tile colors

const levels = [
  {
    objective: 'Collect 10 red tiles',
    targetColor: 'red',
    targetCount: 10,
    obstacles: [
      { row: 2, col: 2, type: 'jelly' },
      { row: 4, col: 4, type: 'chocolate' },
      // Add more obstacles for each level as needed
    ],
    timeLimit: 60 // Time limit in seconds for the level
  },
  {
    objective: 'Collect 15 blue tiles',
    targetColor: 'blue',
    targetCount: 15,
    obstacles: [
      { row: 3, col: 3, type: 'licorice' },
      { row: 5, col: 5, type: 'jelly' },
      // Add more obstacles for each level as needed
    ],
    timeLimit: 90 // Time limit in seconds for the level
  },
  // Add more levels here with different objectives and obstacles
];

const maxLives = 5; // Maximum number of lives the player can have
const lifeRegenerationTime = 60 * 5; // Time in seconds for a life to regenerate

function App() {
  const [board, setBoard] = useState([]); // The game board state
  const [selectedTile, setSelectedTile] = useState(null); // Currently selected tile
  const [currentLevel, setCurrentLevel] = useState(0); // Current level
  const [timeRemaining, setTimeRemaining] = useState(0); // Time remaining for the level
  const [lives, setLives] = useState(maxLives); // Number of lives remaining
  const [nextLifeTime, setNextLifeTime] = useState(0); // Time in seconds until the next life regenerates
  const [score, setScore] = useState(0); // Current score
  const [unlockedLevels, setUnlockedLevels] = useState(1); // Number of levels unlocked by the player

  // Function to initialize the game board based on the current level
  const initializeBoard = () => {
    const newBoard = [];
    for (let row = 0; row < 8; row++) {
      const newRow = [];
      for (let col = 0; col < 8; col++) {
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        newRow.push(randomColor);
      }
      newBoard.push(newRow);
    }
    setBoard(newBoard);
  };

  // Function to handle tile click
  const handleTileClick = (row, col) => {
    if (selectedTile) {
      // Check if the selected tile is adjacent to the clicked tile
      if (
        (selectedTile.row === row && Math.abs(selectedTile.col - col) === 1) ||
        (selectedTile.col === col && Math.abs(selectedTile.row - row) === 1)
      ) {
        swapTiles(selectedTile, { row, col });
      } else {
        setSelectedTile({ row, col });
      }
    } else {
      setSelectedTile({ row, col });
    }
  };

  // Function to swap two tiles on the board
  const swapTiles = (tile1, tile2) => {
    const { row: row1, col: col1 } = tile1;
    const { row: row2, col: col2 } = tile2;
    const newBoard = [...board];

    // Swap the colors of the two tiles
    const tempColor = newBoard[row1][col1];
    newBoard[row1][col1] = newBoard[row2][col2];
    newBoard[row2][col2] = tempColor;

    setBoard(newBoard);
    setSelectedTile(null);

    checkForMatches(newBoard);
  };

  // Function to check for matches on the board
  const checkForMatches = (currentBoard) => {
    const newBoard = [...currentBoard];
    let foundMatches = false;
    let newScore = score; // Variable to track the updated score

    // Check for horizontal matches...
    // Check for vertical matches...

    if (foundMatches) {
      setBoard(newBoard);
      setScore(newScore); // Update the score state

      checkForMatches(newBoard); // Recursively check for additional matches
    } else {
      const level = levels[currentLevel];
      const targetCount = countTiles(newBoard, level.targetColor);
      if (targetCount >= level.targetCount) {
        if (currentLevel === levels.length - 1) {
          // All levels completed, game over or other logic can be implemented here
          console.log('Game Over!');
        } else {
          // Move to the next level and unlock the next level if not already unlocked
          const nextLevel = currentLevel + 1;
          setCurrentLevel(nextLevel);
          if (nextLevel > unlockedLevels) {
            setUnlockedLevels(nextLevel);
          }
          initializeBoard();
        }
      } else {
        // Level failed, deduct a life
        deductLife();
      }
    }
  };

  // Function to count the number of tiles of a specific color on the board
  const countTiles = (currentBoard, color) => {
    let count = 0;
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        if (currentBoard[row][col] === color) {
          count++;
        }
      }
    }
    return count;
  };

  // Function to generate a random color
  const getRandomColor = () => {
    return colors[Math.floor(Math.random() * colors.length)];
  };

  // Function to handle life deduction
  const deductLife = () => {
    if (lives > 0) {
      setLives((prevLives) => prevLives - 1);
    } else {
      // Game over or other logic can be implemented here
      console.log('Game Over!');
    }
  };

  // Function to handle life regeneration
  const regenerateLife = () => {
    if (lives < maxLives) {
      setLives((prevLives) => prevLives + 1);
      setNextLifeTime(Date.now() + lifeRegenerationTime * 1000);
    }
  };

  // Function to handle timer tick
  const handleTimerTick = () => {
    if (timeRemaining > 0) {
      setTimeRemaining((prevTime) => prevTime - 1);
    } else {
      // Time is up, handle game over or other logic here
      console.log('Time is up!');
    }
  };

  // Function to remove an obstacle from the board
  const removeObstacle = (row, col) => {
    const newBoard = [...board];
    newBoard[row][col] = getRandomColor();
    setBoard(newBoard);
  };

  useEffect(() => {
    initializeBoard();
  }, [currentLevel]);

  useEffect(() => {
    const timer = setInterval(handleTimerTick, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    if (currentLevel < levels.length) {
      setTimeRemaining(levels[currentLevel].timeLimit);
    }
  }, [currentLevel]);

  return (
    <div className="App">
      <h1>Match-3 Game</h1>
      <h2>Level {currentLevel + 1}</h2>
      <h3>{levels[currentLevel]?.objective}</h3>
      <div className="timer">Time Remaining: {timeRemaining} seconds</div>
      <div className="score">Score: {score}</div>
      <div className="lives">Lives: {lives}</div>
      <div className="board">
        <TransitionGroup component={null}>
          {board.map((row, rowIndex) =>
            row.map((color, colIndex) => {
              const obstacle = levels[currentLevel]?.obstacles.find(
                (obs) => obs.row === rowIndex && obs.col === colIndex
              );
              return (
                <CSSTransition key={`${rowIndex}-${colIndex}`} timeout={300} classNames="tile">
                  <div
                    className={`tile ${selectedTile && selectedTile.row === rowIndex && selectedTile.col === colIndex ? 'selected' : ''}`}
                    style={{ backgroundColor: color }}
                    onClick={() => handleTileClick(rowIndex, colIndex)}
                  >
                    {obstacle && (
                      <div className={`obstacle ${obstacle.type}`} onClick={() => removeObstacle(rowIndex, colIndex)}></div>
                    )}
                  </div>
                </CSSTransition>
              );
            })
          )}
        </TransitionGroup>
      </div>
      <div className="level-progression">
        {levels.map((level, index) => (
          <div
            key={index}
            className={`level-indicator ${index < unlockedLevels ? 'unlocked' : 'locked'}`}
            onClick={() => setCurrentLevel(index)}
          >
            {index + 1}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;

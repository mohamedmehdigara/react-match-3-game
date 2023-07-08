import React, { useState, useEffect } from 'react';
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
    ]
  },
  {
    objective: 'Collect 15 blue tiles',
    targetColor: 'blue',
    targetCount: 15,
    obstacles: [
      { row: 3, col: 3, type: 'licorice' },
      { row: 5, col: 5, type: 'jelly' },
      // Add more obstacles for each level as needed
    ]
  },
  // Add more levels here with different objectives and obstacles
];

function App() {
  const [board, setBoard] = useState([]); // The game board state
  const [selectedTile, setSelectedTile] = useState(null); // Currently selected tile
  const [currentLevel, setCurrentLevel] = useState(0); // Current level

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

    // Check for horizontal matches
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 6; col++) {
        if (
          newBoard[row][col] === newBoard[row][col + 1] &&
          newBoard[row][col] === newBoard[row][col + 2]
        ) {
          foundMatches = true;
          // Replace matching tiles with new colors
          newBoard[row][col] = getRandomColor();
          newBoard[row][col + 1] = getRandomColor();
          newBoard[row][col + 2] = getRandomColor();
        }
      }
    }

    // Check for vertical matches
    for (let row = 0; row < 6; row++) {
      for (let col = 0; col < 8; col++) {
        if (
          newBoard[row][col] === newBoard[row + 1][col] &&
          newBoard[row][col] === newBoard[row + 2][col]
        ) {
          foundMatches = true;
          // Replace matching tiles with new colors
          newBoard[row][col] = getRandomColor();
          newBoard[row + 1][col] = getRandomColor();
          newBoard[row + 2][col] = getRandomColor();
        }
      }
    }

    if (foundMatches) {
      setBoard(newBoard);
      checkForMatches(newBoard); // Recursively check for additional matches
    } else {
      const level = levels[currentLevel];
      const targetCount = countTiles(newBoard, level.targetColor);
      if (targetCount >= level.targetCount) {
        if (currentLevel === levels.length - 1) {
          // All levels completed, game over or other logic can be implemented here
          console.log('Game Over!');
        } else {
          // Move to the next level
          setCurrentLevel(currentLevel + 1);
          initializeBoard();
        }
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

  // Function to remove an obstacle from the board
  const removeObstacle = (row, col) => {
    const newBoard = [...board];
    newBoard[row][col] = getRandomColor();
    setBoard(newBoard);
  };

  useEffect(() => {
    initializeBoard();
  }, [currentLevel]);

  return (
    <div className="App">
      <h1>Match-3 Game</h1>
      <h2>Level {currentLevel + 1}</h2>
      <h3>{levels[currentLevel].objective}</h3>
      <div className="board">
        {board.map((row, rowIndex) =>
          row.map((color, colIndex) => {
            const obstacle = levels[currentLevel].obstacles.find(
              (obs) => obs.row === rowIndex && obs.col === colIndex
            );
            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`tile ${selectedTile && selectedTile.row === rowIndex && selectedTile.col === colIndex ? 'selected' : ''}`}
                style={{ backgroundColor: color }}
                onClick={() => handleTileClick(rowIndex, colIndex)}
              >
                {obstacle && (
                  <div className={`obstacle ${obstacle.type}`} onClick={() => removeObstacle(rowIndex, colIndex)}></div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default App;

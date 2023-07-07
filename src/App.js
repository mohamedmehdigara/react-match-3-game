import React, { useState, useEffect } from 'react';
import './App.css';

const colors = ['red', 'blue', 'green', 'yellow', 'orange']; // Available tile colors

function App() {
  const [board, setBoard] = useState([]); // The game board state
  const [selectedTile, setSelectedTile] = useState(null); // Currently selected tile

  // Function to initialize the game board
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
      // No more matches found, game over or other logic can be implemented here
    }
  };

  // Function to generate a random color
  const getRandomColor = () => {
    return colors[Math.floor(Math.random() * colors.length)];
  };

  useEffect(() => {
    initializeBoard();
  }, []);

  return (
    <div className="App">
      <h1>Match-3 Game</h1>
      <div className="board">
        {board.map((row, rowIndex) =>
          row.map((color, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`tile ${selectedTile && selectedTile.row === rowIndex && selectedTile.col === colIndex ? 'selected' : ''}`}
              style={{ backgroundColor: color }}
              onClick={() => handleTileClick(rowIndex, colIndex)}
            ></div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;

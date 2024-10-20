import "./App.css";
import { useState } from "react";
function Square({ value, onSquareClick }) {
    // const [value, setValue] = useState(null);
    //   function handleClick() {
    //       setValue('x');
    //   }
    return (
        <button className="square" onClick={onSquareClick}>
            {value}
        </button>
    );
}
function Board({ xIsNext, squares, onPlay }) {
    const winner = calculateWinner(squares);
    let status;
    if (winner) {
        status = "Winner: " + winner;
    } else {
        status = "Next player: " + (xIsNext ? "X" : "O");
    }
    function handlClick(i) {
        if (squares[i] || calculateWinner(squares)) {
            return;
        }
        const nextSquares = squares.slice();
        if (xIsNext) {
            nextSquares[i] = "X";
        } else {
            nextSquares[i] = "O";
        }
        onPlay(nextSquares);
    }
    function calculateWinner(squares) {
        const lines = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
        ];
        for (let i = 0; i < lines.length; i++) {
            const [a, b, c] = lines[i];
            if (
                squares[a] &&
                squares[a] === squares[b] &&
                squares[a] === squares[c]
            ) {
                return squares[a];
            }
        }
        return null;
    }
    const renderSquares = (start, end) => {
        const row = [];
        for (let i = start; i< end ; i++) {
            row.push(<Square key={i} value={squares[i]} onSquareClick={() => handlClick(i)} />);
        }
        return row;
    }
    return (
        <>
            <div className="status">{status}</div>
            {[0, 3, 6].map((rowStart) => {
                return (
                    <div key={rowStart} className="board-row">
                        {renderSquares(rowStart, rowStart + 3)}
                    </div>
                )
            })}
        </>
    );
}
function Game() {
    const [history, setHistory] = useState([Array(9).fill(null)]);
    const [currentMove, setCurrentMove] = useState(0);
    const currentSquares = history[currentMove];
    const [isDescending, setIsDescending] = useState(false);
    const xIsNext = currentMove % 2 === 0;
    function handlePlay(nextSquares) {
        const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
        setHistory(nextHistory);
        setCurrentMove(nextHistory.length - 1);
    }
    function jumpTo(nextMove) {
        setCurrentMove(nextMove);
    }
    function toggleSort() {
        setIsDescending(!isDescending);
      }
    const moves = history.map((squares, move) => {
        const row = Math.floor(history[move].indexOf('X') / 3) + 1;
        const col = history[move].indexOf('X') % 3 + 1;
    
        let description;
        if (move === currentMove) {
          description = `You are at move #${move} (${row}, ${col})`;
        } else if (move > 0) {
          description = `Go to move #${move} (${row}, ${col})`;
        } else {
          description = "Go to game start";
        }
    
        return (
          <li key={move}>
            <button
              onClick={() => jumpTo(move)}
              className={move === currentMove ? "bold" : ""}
            >
              {description}
            </button>
          </li>
        );
      });
      return (
        <div className="game">
          <div className="game-board">
            <Board
              xIsNext={xIsNext}
              squares={currentSquares}
              onPlay={handlePlay}
            />
          </div>
          <div className="game-info">
            <button onClick={toggleSort}>
              Sort {isDescending ? "Ascending" : "Descending"}
            </button>
            <ol>{isDescending ? moves.reverse() : moves}</ol>
          </div>
        </div>
      );
}
function App() {
    return (
        <div className="App">
            <header className="App-header">
                <Game />
            </header>
        </div>
    );
}

export default App;

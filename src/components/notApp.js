import PropTypes from 'prop-types';
import { createSequencedArray, randArray, getGameIndex } from '../utils/utilities.js';
import { getXYSquare, makeGuess, setup, init } from '../utils/puzzle.js';
import Cell from './Cell';
import Controls from './Controls';
import Puzzle from './Puzzle';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sideLength: 9,
      limit: 81,
      allGuesses: setup({ sideLength: 9 })
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSolve = this.handleSolve.bind(this);
    this.handleClear = this.handleClear.bind(this);
  }

  handleChange(e, i){
    const allGuesses = this.state.allGuesses.map((guess, index) => {
      if (index === parseInt(i, 10)) {
        return {
          ...guess,
          value: e.target.value,
          userValue: true,
          visible: true
        };
      }
      return guess;
    })

    this.setState(prevState => ({
      allGuesses,
    }));
  }

  handleSolve(e){
    const diff = parseInt(e.target.value, 10);

    // clean guesses
    const allGuesses = setup({ 
      diff, 
      sideLength: this.state.sideLength, 
      allGuesses: this.state.allGuesses,
    });

    const opts = { 
      sideLength: this.state.sideLength,
      allGuesses,
      guessIndex: 0,
      limit: this.state.limit,
      forward: true,
      diff,
      gameIndex: e.target.value ? getGameIndex({
        limit: this.state.limit,
        diff
      }) : undefined
    };

    const solvedGuesses = makeGuess(opts);

    this.setState(prevState => ({
      allGuesses: solvedGuesses,
    }));
  }

  handleClear(e){
    const clearAll = parseInt(e.target.value, 10);
    let clearedGuesses;

    if (clearAll === 1) {
      // clear entire puzzle
      clearedGuesses = setup({ sideLength });
    } else {
      // clear cpu guesses
      clearedGuesses = setup({
        sideLength: this.state.sideLength,
        allGuesses: this.state.allGuesses
      });
    }

    this.setState(prevState => ({
      allGuesses: clearedGuesses,
    }));
  }

  render() {
    return (
      <div className="Sudoku">
        <Puzzle
          cells={this.state.allGuesses} 
          handleChange={this.handleChange} />
        <Controls
          handleClear={this.handleClear}
          handleSolve={this.handleSolve} />
      </div>
    );
  }
}

export default App;
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Cell from './Cell';
import getVisibleGuesses from '../selectors/guesses';

const Puzzle = (props) => {
  return (
    <ul id="puzzle" className="Sudoku__puzzle">
      { props.guesses.map((cell, index) => {
        return (
          <Cell
            key={index}
            cell={cell} />
        )
      })
    }
    </ul>
  );
}

Puzzle.propTypes = {
  guesses: PropTypes.array.isRequired
}

const mapStateToProps = state => {
  return ({
    guesses: getVisibleGuesses(state.guesses, state.controls),
    // guesses: getVisibleGuesses(state.guesses, state.filters) include the filters when needed
  });
}

export default connect(mapStateToProps)(Puzzle);

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { setupGame, clearGame } from '../actions/controls';
import { resetPuzzle, solvePuzzle } from '../actions/guesses';

class Controls extends React.Component {
  handleSolve = (e) => {
    this.props.solvePuzzle();
  };
  handleGameSetup = (e) => {
    console.log(`${e.target.value}_GAME`);
    this.props.setupGame(`${e.target.value}_GAME`);
    this.props.solvePuzzle();
  };
  handleReset = (e) => {
    this.props.resetPuzzle(`${e.target.value}_RESET_PUZZLE`);
    if (e.target.value === 'HARD') {
      this.props.clearGame();
    }
  };
  render() {
    return (
      <aside id="controls" className="Sudoku__controls">
        <div className="controls__group">
          <button 
            className="h4 btn btn--action btn--easy" 
            value="EASY" 
            onClick={this.handleGameSetup}>
            Easy
          </button>
          <button 
            className="h4 btn btn--action btn--medium" 
            value="MEDIUM" 
            onClick={this.handleGameSetup}>
            Medium
          </button>
          <button 
            className="h4 btn btn--action btn--hard" 
            value="HARD" 
            onClick={this.handleGameSetup}>
            Hard
          </button>
        </div>
        <div className="controls__group">
          <button 
            className="h4 btn btn--white" 
            onClick={this.handleSolve}>
            Solve
          </button>
          <button 
            className="h4 btn"
            value='SOFT'
            onClick={this.handleReset}>
            Clear Solution
          </button>
          <button 
            className="h4 btn btn--inverted"
            value='HARD'
            onClick={this.handleReset}>
            Clear All
          </button>
        </div>
      </aside>
    );
  }
}

Controls.propTypes = {
  setupGame: PropTypes.func.isRequired,
  resetPuzzle: PropTypes.func.isRequired,
  solvePuzzle: PropTypes.func.isRequired,
};

// on here you define your dispatcher functions, which will be mapped and called
const mapDispatchToProps = (dispatch) => ({
  // set the names of these to be the same as the name of the action generator
  setupGame: (type) => dispatch(setupGame(type)),
  resetPuzzle: (type) => dispatch(resetPuzzle(type)),
  solvePuzzle: () => dispatch(solvePuzzle()),
  clearGame: () => dispatch(clearGame())
});

// mapStateToProps, mapDispatchToProps
export default connect(undefined, mapDispatchToProps)(Controls);
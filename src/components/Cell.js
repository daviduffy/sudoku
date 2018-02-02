import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { editGuess } from '../actions/guesses';

class Cell extends React.Component {
  handleChange = (e) => {
    this.props.editGuess(this.props.cell.index, {
      ...this.props.cell,
      userValue: e.target.value
    })
  };
  render() {
    const { userValue, value } = this.props.cell;
    const { inGame, cpuValue } = this.props;
    let visibleValue;
    // if a game is current in progress
    if (inGame) {
      // if this cell is a CPU-granted cell
      if (cpuValue) {
        // show the actual cell value
        visibleValue = value;
      } else {
        // otherwise hide the value and show the userValue instead
        visibleValue = userValue;
      }
    // if it's not a game, show whatever's there, preferring the user value
    } else {
      visibleValue = userValue || value;
    }
    return (
      <li className={userValue ? 'user-value' : ''}>
        <input 
          type="number"
          maxLength="1"
          value={visibleValue}
          pattern="[0-9]{1}"
          onChange={this.handleChange} />
      </li>
    )
  }
}

Cell.propTypes = {
  value: PropTypes.string
}

const mapStateToProps = (state, props) => ({
  inGame: state.controls.diff !== '',
  // if a game is going on and the value is in the 'revealed' array
  cpuValue: state.controls.diff !== '' && state.controls.game.includes(parseFloat(props.cell.index), 10)
})

// on here you define your dispatcher functions, which will be mapped and called
const mapDispatchToProps = (dispatch) => ({
  // set the names of these to be the same as the name of the action generator
  editGuess: (index, guess) => dispatch(editGuess(index, guess))
});

// mapStateToProps, mapDispatchToProps
export default connect(mapStateToProps, mapDispatchToProps)(Cell);
import { createSequencedArray, randArray, getGameIndex } from './utilities.js';

// Get row, column, and square arrays
// =================================================================================================
export const getXYSquare = ({ sideLength, allGuesses, guessIndex }) => {

  // ex: 52
  const XYS = {
    //  5
    rowNumber: ~~(guessIndex / sideLength),
    // 45
    rowStartIndex() {return (this.rowNumber * sideLength);},
    //  3
    rowSquareIndex() {return (~~(this.rowNumber / 3) * 3);},
    //  7
    colStartIndex: (guessIndex % sideLength || 0),
    //  6
    colSquareIndex() {return (~~(this.colStartIndex / 3) * 3);},
    // 33
    squareStartIndex() {return (this.rowSquareIndex() * sideLength + this.colSquareIndex());},
  };
  const arr = Array(sideLength).fill(undefined);
  const outputArrays = {
    row: [...arr].map((item, index) => {
      const theGuess = allGuesses[(XYS.rowStartIndex() + index)];
      if (theGuess.userValue) {
        return theGuess.userValue;
      }
      return theGuess.value;
    }),
    column: [...arr].map((item, index) => {
      const theGuess = allGuesses[(XYS.colStartIndex + (sideLength * index))];
      if (theGuess.userValue) {
        return theGuess.userValue;
      }
      return theGuess.value;
    }),
    square: [],
  };
  // build square indexes array (this one is tricky)
  for (let sr = 0; sr < 3; sr++) {
    for (let sc = 0; sc < 3; sc++) {
      let val;
      const theGuess = allGuesses[XYS.squareStartIndex() + ((sr * 9) + sc)];
      if (theGuess.userValue) {
        val = theGuess.userValue;
      } else {
        val = theGuess.value;
      }
      outputArrays.square.push(val);
    }
  }
  return outputArrays;
};

// Guess Logic
// =================================================================================================
export const makeGuess = ({ sideLength = 9, allGuesses, guessIndex = 0, limit = 81, forward = true }) => {
  // console.log('allGuesses:', allGuesses, 'guessIndex:', guessIndex)
  if (guessIndex < limit) {
    // use the current `guessIndex` value to get a guess from allGuesses
    const currentGuess = allGuesses[guessIndex];
    // see if this guess still has available options
    if (currentGuess.options.length !== 0) {
      // get row, column, and square array contexts for current guess value
      const currentContext = getXYSquare({ sideLength, allGuesses, guessIndex });
      // if this is not user input
      if (currentGuess.userValue) {
        if (forward) {
          guessIndex++;
          return makeGuess({
            sideLength,
            allGuesses,
            guessIndex,
            limit,
            forward: true
          });
        } else {
          guessIndex--;
          return makeGuess({
            sideLength,
            allGuesses,
            guessIndex,
            limit,
            forward: false
          });
        }
      }
      // assign a random integer from the guess.options
      currentGuess.value = currentGuess.options.splice(~~(Math.random() * currentGuess.options.length), 1)[0];
      // if the random guess value is not in the row array
      if (currentContext.row.indexOf(currentGuess.value) === -1) {
        // vertical plane tests
        if (currentContext.column.indexOf(currentGuess.value) === -1) {
          // square in grid tests
          if (currentContext.square.indexOf(currentGuess.value) === -1) {
            // increment the cell you're move to the next index
            guessIndex++;
            forward = true;
            return makeGuess({
              sideLength,
              allGuesses,
              guessIndex,
              limit,
              forward: true
            });
          }
        }
      }
    // this guess value is impossible because a previous guess is incorrect
    } else {
      currentGuess.options = createSequencedArray(sideLength);
      currentGuess.value = undefined;
      guessIndex--;
    }
    return makeGuess({
      sideLength,
      allGuesses,
      guessIndex,
      limit,
      forward: false
    });
  }
  return allGuesses;
};

// Set up allGuesses object for use or re-use
// =================================================================================================
export const setup = ({ sideLength = 9, diff, allGuesses: currentGuesses }) => {

  // when defined, difficulty causes value visibility to change
  const limit = sideLength * sideLength;
  const gameIndex = diff ? getGameIndex({
            limit: sideLength * sideLength,
            diff }) : [];

  // if there is no current set of guesses, make an array that's the right size to map over
  if (currentGuesses === undefined) {
    currentGuesses = Array(limit).fill(undefined);
  }

  const allGuesses = currentGuesses.map((guess, index) => {
      // keep any existing guess
      if (guess !== undefined && guess.userValue) {
        return guess;
      }
      // return a new obj for non-user-input
      return singleGuess(index, diff);
    });

  return allGuesses;
};

export const singleGuess = (index, diff) => ({
  options: createSequencedArray(9),
  value: '',
  index,
  userValue: '',
});

export const stripGuesses = (guesses) => {
  return guesses.map((guess, ind) => {
    if (guess.userValue) {
      return guess;
    }
    return singleGuess(ind);
  })
}
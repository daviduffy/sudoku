// Array building utility
// =================================================================================================
const createSequencedArray = lim => Array(lim).fill(null).map((e, index) => (index + 1));

// Array building utility
// =================================================================================================
const randArray = ({ desired, max }) => {
  const donor = createSequencedArray(max);
  const rand = [];
  for (let i = 0; i < desired; i++) {
    const float = donor.splice(~~(Math.random() * donor.length), 1)[0];
    rand.push(float);
  }
  return rand;
};

// Game version creator
// =================================================================================================
const getGameIndex = ({ limit, diff }) => {
  let desired;
  switch (diff) {
    default:
      desired = limit;
      break;
    case 1:
      desired = 35;
      break;
    case 2:
      desired = 30;
      break;
    case 3:
      desired = 25;
      break;
    case 4:
      desired = 20;
      break;
  }
  return randArray({
    desired,
    max: limit,
  });
};

// Initial State
// =================================================================================================
const getInitialState = ({ cellWidth: num, diff }) => {
  // when defined, difficulty causes value visibility to change
  const init = {
    cellWidth: num,
    sideLength: num * num,
    guessIndex: 0,
    limit: (num * num) * (num * num),
    forward: true,
    gameIndex: diff ? getGameIndex({
      limit: (num * num) * (num * num),
      diff
    }) : undefined,
    diff,
  };
  // fast way to create an array of these objects
  const allGuesses = Array(init.limit).fill(null).map((e, index) => ({
    options: createSequencedArray(init.sideLength),
    value: null,
    visible: diff ? init.gameIndex.includes(index) : true,
    index,
    userValue: null,
  }));
  init.allGuesses = allGuesses;
  return init;
};

// UI Logic
// =================================================================================================
const addListeners = () => {
  document.querySelectorAll('input').forEach((input) => {
    input.addEventListener('keydown', (e) => {
      e.preventDefault();
      // this is jank
      if (['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'Backspace'].includes(e.key)) {
        input.value = e.key;
        input.parentNode.classList.add('user-value');
        console.log(e.key);
      }
    });
  });
};

// Get row, column, and square arrays
// =================================================================================================
const getXYSquare = ({ sideLength, allGuesses, guessIndex }) => {
  // ex: 52
  const XYS = {
    //  5
    rowNumber: ~~(guessIndex / sideLength),
    // 45
    get rowStartIndex() {
      return this.rowNumber * sideLength;
    },
    //  3
    get rowSquareIndex() {
      return ~~(this.rowNumber / 3) * 3;
    },
    //  7
    colStartIndex: (guessIndex % sideLength || 0),
    //  6
    get colSquareIndex() {
      return ~~(this.colStartIndex / 3) * 3;
    },
    // 33
    get squareStartIndex() {
      return this.rowSquareIndex * sideLength + this.colSquareIndex;
    },
  };
  const arr = Array(sideLength).fill(undefined);
  const outputArrays = {
    row: [...arr].map((item, index) => allGuesses[(XYS.rowStartIndex + index)].value),
    column: [...arr].map((item, index) => allGuesses[(XYS.colStartIndex + (sideLength * index))].value),
    square: [],
  };
  // build square indexes array (this one is tricky)
  for (let sr = 0; sr < 3; sr++) {
    for (let sc = 0; sc < 3; sc++) {
      const val = allGuesses[XYS.squareStartIndex + ((sr * 9) + sc)].value;
      outputArrays.square.push(val);
    }
  }
  return outputArrays;
};

// Create the markup with values from guesses
// =================================================================================================
const doMarkup = ({ allGuesses, gameIndex, diff }) => {
  const puzzle = document.getElementById('puzzle');
  // empty the container. faster than innerHTML = ''
  while (puzzle.firstChild) {
    puzzle.removeChild(puzzle.firstChild);
  }
  const html = allGuesses.map((guess, index) => {
    let val;
    const classes = [];
    // if difficulty is specified only output based on visible prop
    if (diff) {
      if (guess.visible) {
        val = guess.value;
        classes.push('game-value');
      } else {
        val = '';
      }
    // if difficulty not specified
    } else if (guess.userValue) {
      val = guess.userValue;
      classes.push('user-value');
    } else {
      val = guess.value;
    }
    
    return (
      `<li ${classes.length > 0 ? `class="${classes.join(' ')}"` : ''}>
        <input type="number" 
          maxlength='1' 
          value="${val}"
          pattern="[0-9]{1}">
      </li>`);
  }).join('');
  puzzle.innerHTML = html;
  addListeners();
};

// Guess Logic
// =================================================================================================
const makeGuess = ({ sideLength, allGuesses, guessIndex, limit, forward, diff, gameIndex }) => {
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
            forward: true,
            gameIndex,
            diff
          });
        } else {
          guessIndex--;
          return makeGuess({
            sideLength,
            allGuesses,
            guessIndex,
            limit,
            forward: false,
            gameIndex,
            diff
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
              forward: true,
              gameIndex,
              diff
            });
          }
        }
      }
    // this guess value is impossible because a previous guess is incorrect
    } else {
      currentGuess.options = createSequencedArray(sideLength);
      currentGuess.value = null;
      guessIndex--;
    }
    return makeGuess({
      sideLength,
      allGuesses,
      guessIndex,
      limit,
      forward: false,
      gameIndex,
      diff
    });
  }
  return doMarkup({
    allGuesses,
    gameIndex,
    diff
  });
};

// Clears
// =================================================================================================


// Puzzle Starter
// =================================================================================================
const init = ({ clear = false, diff = undefined, preserveUserInput = false }) => {
  // diff easy 1 through expert 4
  const state = getInitialState({ cellWidth: 3, diff });
  console.log(state);

  if (!clear) {
    // add user input to allGuesses array before guessing anything
    document.querySelectorAll('li').forEach((li, index) => {
      if (li.classList.contains('user-value')) {
        const val = li.querySelector('input').value;
        state.allGuesses[index].value = parseInt(val, 10);
        state.allGuesses[index].userValue = parseInt(val, 10);
      }
    });
    return makeGuess(state);
  } else {
    if (preserveUserInput) {
      Array.from(document
        .querySelectorAll('li'))
        .filter(li => !li.classList.contains('user-value'))
        .forEach(li => {li.querySelector('input').value = '';})
    } else {
      doMarkup({
        allGuesses: createSequencedArray(81),
        diff
      });
    }
    addListeners();
  }
};

// Start her up
// =================================================================================================
init({ clear: true });
addListeners();

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
const getInitialState = (num, diff = undefined) => {
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
    options: createSequencedArray(init.sideLength), // [1, 2, 3, 4, 5, 6, 7, 8, 9]
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
        input.parentNode.classList.add('user-input');
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
const doMarkup = ({ allGuesses, gameIndex }) => {
  const puzzle = document.getElementById('puzzle');
  // empty the container. faster than innerHTML = ''
  while (puzzle.firstChild) {
    puzzle.removeChild(puzzle.firstChild);
  }
  const html = allGuesses.map((guess, index) => {
    let val;
    let classes = 'h4';
    if (guess.visible) {
      val = guess.value;
      classes += ' game-value';
    } else if (guess.userValue) {
      val = guess.userValue;
      classes += ' user-value';
    } else {
      val = '';
    }
    return (
      `<li class="${classes}">
        <input type="number" 
          maxlength='1' 
          value="${val}"
          pattern="[0-9]{1}">
      </li>`);
  }).join('');
  puzzle.innerHTML = html;
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
              gameIndex
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
    });
  }
  return doMarkup({
    allGuesses,
    gameIndex
  });
};

// Puzzle Starter
// =================================================================================================
const init = function (run = 3, diff = 0) {
  // diff easy 1 through expert 4
  const state = getInitialState(3, diff);
  console.log(state);

  // generate a solved puzzle
  if (run === 1) {
    return makeGuess(state);
  } else if (run === 2) {
    document.querySelectorAll('li').forEach((li, index) => {
      if (li.classList.contains('user-input')) {
        const val = li.querySelector('input').value;
        state.allGuesses[index].value = parseInt(val, 10);
        state.allGuesses[index].userValue = parseInt(val, 10);
      }
    });
    return makeGuess(state);
  } else {
    doMarkup({
      allGuesses: createSequencedArray(81),
    });
    addListeners();
  }
};

// Start her up
// =================================================================================================
init();
addListeners();

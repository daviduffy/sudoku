// Array building utility
// =================================================================================================
var createSequencedArray = function( lim ) {
  var arr = [];
  for ( var f = 1; f <= lim; f++ ) {
    arr.push(f);
  }
  return arr;
};

// Initial State
// =================================================================================================
const getInitialState = (num) => {
  const init = {
    cellWidth: num,
    sideLength: num * num,
    guessIndex: 0,
    limit: (num * num) * (num * num),
    forward: true,
  };
  // fast way to create an array of these objects
  const allGuesses = Array(init.limit).fill(null).map((e, index) => ({
    options: createSequencedArray(init.sideLength), // [1, 2, 3, 4, 5, 6, 7, 8, 9]
    value: null,
    index,
    userValue: null,
  }));
  init.allGuesses = allGuesses;
  return init;
};

// UI Logic
// =================================================================================================
const initUI = () => {
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

// Puzzle Logic
// =================================================================================================
const init = function (run) {
  const state = getInitialState(3);

  // generate a solved puzzle
  if (run === 1) {
    return makeGuess(state);
  } else if ( run === 2 ) {    
    var LIs = document.querySelectorAll('li');
    LIs.forEach((li, index) => {
      if (li.classList.contains('user-input')) {
        const val = li.querySelector('input').value;
        // console.log('cell ' + y + ' has value ' + li)
        state.allGuesses[index].value = parseInt(val, 10);
        state.allGuesses[index].userValue = parseInt(val, 10);
        // console.log(allGuesses[y]);
      }
    });

    return makeGuess(state);
    
  } else if ( run === 3 ) {
    doMarkup( createSequencedArray(81) );
    initUI();
  }
};

const makeGuess = function({ sideLength, allGuesses, guessIndex, limit, forward }){
  // console.log('starting makeGuess, guessIndex:', guessIndex) // advanced logging
  if (guessIndex < limit) {

    // use the current `guessIndex` value to get a guess from allGuesses
    var currentGuess = allGuesses[guessIndex];
    // console.log(currentGuess); // advanced logging
    
    // see if this guess still has available options
    if (currentGuess.options.length !== 0) {
    
      // get row, column, and square array contexts for current guess value
      var currentContext = getXYSquare({ sideLength, allGuesses, guessIndex });
      // console.log(currentContext); // advanced logging
      
      // console.log(currentGuess);
      
      // if this is not user input
      if (currentGuess.userValue) {
        // console.log('user input skipped on cycle: ' + guessIndex);
        if (forward) {
          guessIndex++;
          forward = true;
          return makeGuess({ sideLength, allGuesses, guessIndex, limit, forward });

        } else {
          guessIndex--;
          forward = false;
          return makeGuess({ sideLength, allGuesses, guessIndex, limit, forward });
        }

      }
        
      // assign a random integer from the guess.options
      currentGuess.value = currentGuess.options.splice(~~(Math.random()*currentGuess.options.length),1)[0]; 
      // if the random guess value is not in the row array
      if ( currentContext.row.indexOf(currentGuess.value) === -1 ) {
        // vertical plane tests
        if ( currentContext.column.indexOf(currentGuess.value) === -1 ) {
          // square in grid tests
          if ( currentContext.square.indexOf(currentGuess.value) === -1 ) {
            // increment the cell you're move to the next index
            guessIndex++;
            forward = true;
            return makeGuess({ sideLength, allGuesses, guessIndex, limit, forward });
          }
        }
      }
    // this guess value is impossible because a previous guess is incorrect
    } else {
      currentGuess.options = createSequencedArray(sideLength);
      currentGuess.value = null;
      guessIndex--;          
    }
    
    forward = false;
    return makeGuess({ sideLength, allGuesses, guessIndex, limit, forward });

  }
  // console.log(allGuesses, "makeGuess");
  doMarkup( allGuesses );
};


var getXYSquare = function({ sideLength, allGuesses, guessIndex }){
  const XYS = { // ex: 52
    rowNumber: ~~( guessIndex / sideLength ),    //  5
    get rowStartIndex () { 
      return this.rowNumber * sideLength;      // 45
    },
    get rowSquareIndex () {
      return ~~(this.rowNumber/3) * 3;       //  3
    },
    colStartIndex: (guessIndex % sideLength || 0),      //  7
    get colSquareIndex () {
      return ~~(this.colStartIndex/3) * 3;     //  6
    },
    get squareStartIndex () { 
      return this.rowSquareIndex * sideLength + this.colSquareIndex; // 33
    },
  };
  const outputArrays = {
    row: [],
    column: [],
    square: [],
  };

  //build row indexes array
  for ( var r = 0; r < sideLength; r++ ) {
    var rowStartIndex = XYS.rowStartIndex;
    var val = allGuesses[(rowStartIndex + r)].value;
    outputArrays.row.push(val);
  }
  
  //build column indexes array
  for (var c = 0; c < sideLength; c++ ) {
    var val = allGuesses[(XYS.colStartIndex + (sideLength * c))].value;
    outputArrays.column.push(val);
  }
  
  //build square indexes array
  for ( var sr = 0; sr < 3; sr++ ) {
    for ( var sc = 0; sc < 3; sc++ ) {
      var val = allGuesses[XYS.squareStartIndex + ((sr * 9) + sc)].value;
      outputArrays.square.push(val);
    }
  }
  return outputArrays;
};

// Creates the markup for the grid layout
const doMarkup = function( allGuesses ) {
  const container = document.getElementById('container');
  // empty the container. faster than innerHTML = ''
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
  const grid = document.createElement('UL');
  grid.className = 'grid';
  html = allGuesses.map((guess, index) => 
    `<li data-index="${index}" ${guess.userValue ? 'class="user-input"' : null}>
      <input type="number" 
        maxlength='1' 
        value="${allGuesses[index].value || ''}"
        pattern="[0-9]{1}">
    </li>`).join('');
  // for (var i = 0; i < allGuesses.length; i++ ) {
  //   var li = document.createElement('LI');
  //   li.setAttribute('data-index', i);
  //   if (allGuesses[i].userValue) {
  //     li.classList.add('user-input');
  //   }
  //   const input = ``;
  //   li.innerHTML = input;
  grid.innerHTML = html;
  
  container.appendChild(grid);
};

var randArray = function ( sideLength ) {
  var donor = createSequencedArray( sideLength );
  var rand = [];
  for (var i = 0; i < sideLength; i++) {
    var float = donor.splice(~~(Math.random() * donor.length),1)[0];
    rand.push(float);
  }
  return rand;
};

// placeholder
doMarkup(createSequencedArray(81));
initUI();
document.getElementById('run_puzzle').addEventListener("click", function(){
  init(2);
});
// document.getElementById('solve_puzzle').addEventListener("click", function(){
//   init(2);
// });
document.getElementById('clear_puzzle').addEventListener("click", function(){
  document.getElementById('run_puzzle').innerHTML = 'Generate Sudoku' ;
  init(3);
});

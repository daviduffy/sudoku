// UI Logic
// ========
const initUI = function() {
    let theLIs = document.getElementsByTagName('LI');
    let UIActive = false;

    for (let z = 0; z < theLIs.length; z++) {
        theLIs[z].addEventListener("click", function(elem){
            // get current value of cell
            let span = this.querySelectorAll('SPAN')[0]
            let val = span.innerHTML;
            if (val){
                console.log("value of this cell is " + val);
            }

            // create input element
            let input = document.createElement('INPUT');
            let dataIndex = this.getAttribute('data-index');
            input.setAttribute('type','number');
            input.setAttribute('id','li_' + dataIndex);

            // set value of input element if there is one
            if ( parseInt(val) ) {
                input.setAttribute( 'value', val );
            }

            // remove span element
            this.removeChild(span);
            // console.log(span);
            this.appendChild(input);

            // focus new input element
            input.focus();
            input.addEventListener("focusout",function(){
                // this.this.querySelectorAll('SPAN')[0]
                // this.removeChild(input);
                let id = this.getAttribute('id');
                nInput = document.getElementById(id);
                // console.log(id);
                // console.log(nInput.value, "initUI");
                span.innerHTML = nInput.value;
                let li = nInput.parentNode;
                if ( nInput.value ) {
                    li.setAttribute('class', 'user-input');
                    UIActive = true;
                }
                li.removeChild(nInput);
                li.appendChild(span);
                if ( UIActive === true ) {
                    document.getElementById('run_puzzle').innerHTML = 'Solve Sudoku' ;
                }
            });
            
        });
    }
};



// Puzzle Logic
// ============
let init = function( run ){
    let cellWidth = 3
      , sideLength = cellWidth * cellWidth
      , allGuesses = []
      , guessIndex = 0
      , limit = sideLength * sideLength
      ;

    // fill up main arrays with unique instances of `singleGuess`
    for ( let b = 0; b < (sideLength * sideLength); b++ ) {
        let singleGuess = {
            options: createSequencedArray( sideLength ), // [1, 2, 3, 4, 5, 6, 7, 8, 9]
            value: null,
            index: b,
            userValue: null,
        }
        // console.log("creating guess object");
        allGuesses.push(singleGuess);
    }
    
    // generate a solved puzzle
    if (run === 1) {
        return makeGuess( sideLength, allGuesses, guessIndex, limit, true );        
    }
    
    if ( run === 2 ) {
        // place first group of 9 and then solve puzzle
        // turboStart( cellWidth, sideLength, allGuesses );
        // console.log("current puzzle ",allGuesses);
        // doMarkup( allGuesses )
        
        let LIs = document.getElementsByTagName('li');
        for (let y = 0; y < LIs.length; y++) {
            currentLI = LIs[y];
            if ( currentLI.classList.contains('user-input') ) {
                // console.log('cell ' + y + ' has value ' + currentLI)
                let currentSpan = currentLI.querySelector('span');
                allGuesses[y].value = parseInt(currentSpan.innerHTML);
                allGuesses[y].userValue = parseInt(currentSpan.innerHTML);
                // console.log(allGuesses[y]);
            }
        }
        return makeGuess( sideLength, allGuesses, guessIndex, limit, true );
        
    } if ( run === 3 ) {
        doMarkup( createSequencedArray(81) );
        initUI();
    }

}

// let turboStart = function ( cellWidth, sideLength, allGuesses ) {
//     let rAr = randArray( sideLength )
//       , startIndex = sideLength * cellWidth + cellWidth
//       , float = null
//       ;
//     // console.log(cellWidth, sideLength, allGuesses)
//     for ( let i = 0; i < cellWidth; i++ ) {
//         for ( let j = 0; j < cellWidth; j++ ) {
//             float = rAr.splice(~~(Math.random() * rAr.length),1)[0];
//             let bub = allGuesses[startIndex + (i*sideLength) + j];
//             // console.log(bub);
//             bub.value = float;
//         }   
//     }
// }

let createSequencedArray = function( lim ) {
    let arr = [];
    for ( let f = 1; f <= lim; f++ ) {
        arr.push(f);
    }
    return arr;
}

let makeGuess = function( sideLength, allGuesses, guessIndex, limit, forward ){
    // console.log('starting makeGuess, guessIndex:', guessIndex) // advanced logging
    if ( guessIndex < limit ) {

        // use the current `guessIndex` value to get a guess from allGuesses 
        let currentGuess = allGuesses[guessIndex];
        // console.log(currentGuess); // advanced logging
        
        // see if this guess still has available options
        if ( currentGuess.options.length !== 0) {
        
            // get row, column, and square array contexts for current guess value
            let currentContext = getXYSquare( sideLength, allGuesses, guessIndex );
            // console.log(currentContext); // advanced logging
            
            // console.log(currentGuess);
            
            // if this is not user input
            if ( currentGuess.userValue ) {
                console.log('user input skipped on cycle: ' + guessIndex);
                if ( forward ) {
                    guessIndex++;
                    return makeGuess( sideLength, allGuesses, guessIndex, limit, true );

                } else {
                    guessIndex--;
                    return makeGuess( sideLength, allGuesses, guessIndex, limit, false );
                }

            }
                
            // assign a random integer from the guess.options
            currentGuess.value = currentGuess.options.splice(~~(Math.random()*currentGuess.options.length),1)[0]; 
            // console.warn("on ", guessIndex, " guessing ", currentGuess.value) // basic logging

            // if the random guess value is not in the row array
            if ( currentContext.row.indexOf(currentGuess.value) === -1 ) {
                // console.log('row passed') // advanced logging

                // vertical plane tests
                if ( currentContext.column.indexOf(currentGuess.value) === -1 ) {
                    // console.log( 'column passed' ); // advanced logging

                    // square in grid tests
                    if ( currentContext.square.indexOf(currentGuess.value) === -1 ) {

                        // increment the cell you're move to the next index
                        guessIndex++;
                        // console.log('square passed'); // advanced logging
                        // console.log('good guess! on ', guessIndex, " value ", currentGuess.value); // advanced logging

                        return makeGuess( sideLength, allGuesses, guessIndex, limit, true );

                    }

                }

            }

            // console.log('change guess');
        
            
        // this guess value is impossible because a previous guess is incorrect
        } else {

            // console.error("failure at ", currentGuess, "Rewind.") // basic logging
            currentGuess.options = createSequencedArray(sideLength);
            currentGuess.value = null;
            // console.log("reset: ", currentGuess)
            guessIndex--;
                    
        }
        
        // bad guess
        return makeGuess( sideLength, allGuesses, guessIndex, limit, false );

    }
    // console.log(allGuesses, "makeGuess");
    doMarkup( allGuesses );

};


let getXYSquare = function( sideLength, allGuesses, guessIndex ){
    
    let XYS = { // ex: 52
        rowNumber: ~~( guessIndex / sideLength ),        //  5
        get rowStartIndex () { 
            return this.rowNumber * sideLength;          // 45
        },
        get rowSquareIndex () {
            return ~~(this.rowNumber/3) * 3;             //  3
        },
        
        colStartIndex: (guessIndex % sideLength || 0),          //  7
        get colSquareIndex () {
            return ~~(this.colStartIndex/3) * 3;         //  6
        },
        
        get squareStartIndex () { 
            return this.rowSquareIndex * sideLength + this.colSquareIndex; // 33
        },
    }
    // console.log(XYS)
    let outputArrays = {
        row: [],
        column: [],
        square: [],
    }
    
    //build row indexes array
    for ( let r = 0; r < sideLength; r++ ) {
        let rowStartIndex = XYS.rowStartIndex;
        let val = allGuesses[(rowStartIndex + r)].value;
        outputArrays.row.push(val);
    }
    
    //build column indexes array
    for (let c = 0; c < sideLength; c++ ) {
        let val = allGuesses[(XYS.colStartIndex + (sideLength * c))].value;
        outputArrays.column.push(val);
    }
    
    //build square indexes array
    for ( let sr = 0; sr < 3; sr++ ) {
        for ( let sc = 0; sc < 3; sc++ ) {
            let val = allGuesses[XYS.squareStartIndex + ((sr * 9) + sc)].value;
            outputArrays.square.push(val);
        }
        
    }
    
    return outputArrays;
    
};

// Creates the markup for the grid layout
let doMarkup = function( allGuesses ) {
    
    let container = document.getElementById('container');
    container.innerHTML = '';
    
    
    //create parent DIV to house our ULs
    let grid = document.createElement('UL');
    grid.className = 'grid';
    
    for (let i = 0; i < allGuesses.length; i++ ) {
        
        let li = document.createElement('LI');
        li.setAttribute('data-index', i );
        if ( allGuesses[i].userValue ) {
            li.setAttribute('class', 'user-input');
        }
        let span = document.createElement('SPAN');
        span.innerHTML = ( allGuesses[i].value || '' );
        li.appendChild(span);
        grid.appendChild(li);
        
    }
    container.appendChild(grid);
};

let randArray = function ( sideLength ) {
    let donor = createSequencedArray( sideLength );
    let rand = [];
    for (let i = 0; i < sideLength; i++) {
        let float = donor.splice(~~(Math.random() * donor.length),1)[0];
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
//     init(2);
// });
document.getElementById('clear_puzzle').addEventListener("click", function(){
    document.getElementById('run_puzzle').innerHTML = 'Generate Sudoku' ;
    init(3);
})
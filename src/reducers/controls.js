import { randArray } from '../utils/utilities';

const controlsReducerDefaultState = {
  diff: '',
  game: []
};
export default (state = controlsReducerDefaultState, action) => {
  switch (action.type) {
    case 'CLEAR_GAME':
      return {
        diff: '',
        game: []
      };
    case 'EASY_GAME':
      return {
        diff: 'easy',
        game: randArray({ revealedGuesses: 40, sideLength: 9 })
      };
    case 'MEDIUM_GAME':
      return {
        diff: 'medium',
        game: randArray({ revealedGuesses: 35, sideLength: 9 })
      };
    case 'HARD_GAME':
      return {
        diff: 'hard',
        game: randArray({ revealedGuesses: 30, sideLength: 9 })
      };
    default:
      return state;
  }
};

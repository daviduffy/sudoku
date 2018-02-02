import { setup, singleGuess } from '../utils/puzzle.js';
// const guesses = setup({ sideLength: 9 });

// Get visible guesses
const getVisibleGuesses = (guesses, { diff, game } = {}) => {
  // if (diff !== '') {
  //   guesses.filter((guess) => {
  //     if (game.contains(guess.index)) {

  //     }
  //   })
  // }

  return guesses;
};




// const testing = (expenses, { text, sortBy, startDate, endDate }) => {
//   return expenses.filter((expense) => {
//     const createdAtMoment = moment(expense.createdAt);
//     const startDateMatch = startDate ? startDate.isSameOrBefore(createdAtMoment, 'day') : true;
//     const endDateMatch = endDate ? endDate.isSameOrAfter(createdAtMoment, 'day') : true;
//     const textMatch = text === '' || expense.description.toLowerCase().includes(text.toLowerCase());
//     // console.log(expense.description.toLowerCase());

//     return startDateMatch && endDateMatch && textMatch;
//   }).sort((a, b) => {
//     if (sortBy === 'date') {
//       // -1 a comes first, 1 b comes first
//       // most recent expenses at beginning
//       return a.createdAt < b.createdAt ? 1 : -1;
//     } else if ( sortBy === 'amount' ) {
//       // amount
//       return a.amount < b.amount ? 1 : -1;
//     }
//   });
// };

export default getVisibleGuesses;
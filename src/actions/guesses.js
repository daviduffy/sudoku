export const editGuess = (index, updates) => ({
  type: 'EDIT_GUESS',
  index,
  updates
});

export const resetPuzzle = (type) => ({
  type
});

export const solvePuzzle = () => ({
  type: 'SOLVE_PUZZLE'
});

// Array building utility
// =================================================================================================
export const createSequencedArray = lim => Array(lim).fill(null).map((e, index) => (`${index + 1}`));

// Array building utility
// =================================================================================================
export const randArray = ({ revealedGuesses, sideLength }) => {
  const donor = createSequencedArray(sideLength * sideLength);
  const rand = [];
  for (let i = 0; i < revealedGuesses; i++) {
    const float = donor.splice(~~(Math.random() * donor.length), 1)[0];
    rand.push(parseInt(float, 10));
  }
  return rand;
};

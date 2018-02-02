import PropTypes from 'prop-types';
import Controls from '../components/Controls';
import Puzzle from '../components/Puzzle';

const App = () => (
  <div className="Sudoku">
    <Puzzle />
    <Controls
      handleSolve={() => {}}
      handleClear={() => {}}
    />
  </div>
);

export default App;
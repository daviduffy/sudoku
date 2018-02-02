import { createStore, combineReducers } from 'redux';
import guessesReducer from '../reducers/guesses';
import controlsReducer from '../reducers/controls';


export default () => {
  // Store creation
  const store = createStore(
    combineReducers({
      guesses: guessesReducer,
      controls: controlsReducer
    }),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  );

  return store;
};

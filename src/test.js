import React from 'react';
import ReactDOM, { render } from 'react-dom';

import configureStore from './store/configureStore';
import { editGuess } from './actions/guesses';

const store = configureStore();

console.log(editGuess(1, {
  value: '6',
  userValue: true
}));

const unsubscribe = store.subscribe(() => {
  console.log(store.getState());
});

store.dispatch(editGuess(1, {
  value: '6',
  userValue: true
}));


// ReactDOM.render(<App />, document.getElementById('root'));
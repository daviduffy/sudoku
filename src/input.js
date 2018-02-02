require('./assets/stylesheets/app.sass');

import React from 'react';
import ReactDOM, { render } from 'react-dom';
import App from './containers/App';
import { Provider } from 'react-redux';
import configureStore from './store/configureStore';
import { editGuess } from './actions/guesses';

import PropTypes from 'prop-types';

const store = configureStore();

// console.log(editGuess(1, {
//   value: '6',
//   userValue: true
// }));

const unsubscribe = store.subscribe(() => {
  console.log(store.getState());
});

// store.dispatch(editGuess(1, {
//   value: '6',
//   userValue: true
// }));

const jsx = (
  <Provider store={store}>
    <App />
  </Provider>
);

ReactDOM.render(jsx, document.getElementById('root'));
import { applyMiddleware, createStore } from 'redux';
import { createLogger } from 'redux-logger';
import promise from 'redux-promise-middleware';
import thunk from 'redux-thunk';
import Validator from './validator';
// import { loadState, saveState } from './localStorage';

const reducer = state => {
    return state;
};

// const persistedState = loadState();
const validator = new Validator();
const middleware = applyMiddleware(validator, thunk, promise(), createLogger());
// const middleware = applyMiddleware(validator, thunk, promise());

// const store = createStore(reducer, persistedState, middleware);
const store = createStore(reducer, middleware);

// to persist state in local storage
// store.subscribe(() => {
//     // saveState(store.getState());
// });

export default store;

import { applyMiddleware, createStore } from "redux"
import logger from "redux-logger"
import promise from "redux-promise-middleware"

import reducer, { defaultInitialState } from "./modules"
import { loadState, saveState } from "./localStorage"

const middleware = applyMiddleware(promise(), logger());
const initialState = loadState() || defaultInitialState;

const store = createStore(reducer, initialState, middleware);

// store.subscribe(()=> {
// 	saveState(store.getState());
// });

export default store;
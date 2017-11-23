import { applyMiddleware, createStore } from "redux"
import { createLogger } from "redux-logger"
import promise from "redux-promise-middleware"
import throttle from "redux-throttle"
import thunk from "redux-thunk"

import reducer, { actions } from "./modules"
const { fetchAuthUser, fetchRastertilesets } = actions;

// const middleware = applyMiddleware(thunk, throttle(), promise(), createLogger());
// const middleware = applyMiddleware(thunk, promise(), createLogger());
const middleware = applyMiddleware(thunk, promise());

const store = createStore(reducer, middleware);
store.dispatch(fetchAuthUser());
store.dispatch(fetchRastertilesets());

export default store;
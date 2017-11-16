import { applyMiddleware, createStore } from "redux"
import { createLogger } from "redux-logger"
import promise from "redux-promise-middleware"
import throttle from "redux-throttle"
import thunk from "redux-thunk"

import reducer, { defaultInitialState } from "./modules"
import { fetchAuthUser } from "./modules/auth/auth.actions"
import { fetchRastertilesets } from "./modules/rastertiles/rastertiles.actions"

// const middleware = applyMiddleware(throttle(), promise(), createLogger());
const middleware = applyMiddleware(thunk, promise(), createLogger());
// const middleware = applyMiddleware(thunk, promise());

const store = createStore(reducer, defaultInitialState, middleware);
store.dispatch(fetchAuthUser());
store.dispatch(fetchRastertilesets());

export default store;
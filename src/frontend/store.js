import { applyMiddleware, createStore } from "redux"
import { createLogger } from "redux-logger"
import promise from "redux-promise-middleware"
import throttle from "redux-throttle"

import reducer, { defaultInitialState } from "./modules"
import { fetchUser } from "./modules/auth/auth.actions"

const middleware = applyMiddleware(throttle(), promise(), createLogger());
// const middleware = applyMiddleware(throttle(), promise());

const store = createStore(reducer, defaultInitialState, middleware);
console.log(defaultInitialState);
store.dispatch(fetchUser());


export default store;
import { applyMiddleware, createStore } from "redux";
import { createLogger } from "redux-logger";
import promise from "redux-promise-middleware";
import thunk from "redux-thunk";
import Validator from "./validator";

import reducer, { actions } from "./modules"
const { fetchAuthUser, fetchRastertilesets } = actions;

const validator = new Validator();
const middleware = applyMiddleware(validator, thunk, promise(), createLogger());
// const middleware = applyMiddleware(validator, thunk, promise());

const store = createStore(reducer, middleware);
store.dispatch(fetchAuthUser());
store.dispatch(fetchRastertilesets());

export default store;
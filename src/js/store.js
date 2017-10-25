import { applyMiddleware, createStore } from "redux"
import logger from "redux-logger"
import promise from "redux-promise-middleware"
import throttle from "redux-throttle"

import reducer, { defaultInitialState } from "./modules"
import { loadState, saveState } from "./localStorage"
import { serializeState } from "./modules/medias"

// const middleware = applyMiddleware(throttle(), promise(), logger());
const middleware = applyMiddleware(throttle(), promise());
const initialState = loadState() || defaultInitialState;

const store = createStore(reducer, initialState, middleware);
const serialize = (state)=> {
	return Object.assign({}, state, {
		medias: serializeState(state.medias)
	});
}

store.subscribe(()=> {
	saveState(serialize(store.getState()));
});

export default store;
import { applyMiddleware, createStore } from "redux"
import logger from "redux-logger"
import promise from "redux-promise-middleware"

import { reducer, mapResources } from "./modules"
import { loadState, saveState } from "./localStorage"

const middleware = applyMiddleware(promise(), logger());
const persistedWorldState = loadState();
const defaultInitialWorldState = {
	lat: 37.8,
    long: -96,
    zoom: 0
};
const initialState = {
	world: persistedWorldState || defaultInitialWorldState,
    mapResources: mapResources
}
const store = createStore(reducer, initialState, middleware);

store.subscribe(()=> {
	saveState(store.getState().world);
});

export default store;
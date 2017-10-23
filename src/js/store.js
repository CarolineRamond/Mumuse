import { applyMiddleware, createStore } from "redux"

import logger from "redux-logger"
import promise from "redux-promise-middleware"
import { reducer, mapResources } from "./modules"

const middleware = applyMiddleware(promise(), logger())
const initialState = {
	world: {
        lat: 37.8,
	    long: -96,
	    zoom: 0
    },
    mapResources: mapResources
}
export default createStore(reducer, initialState, middleware)

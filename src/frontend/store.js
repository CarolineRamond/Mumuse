import { applyMiddleware, createStore } from "redux"
import { createLogger } from "redux-logger"
import promise from "redux-promise-middleware"
import throttle from "redux-throttle"

import reducer, { defaultInitialState } from "./modules"
import { serializeState } from "./modules/medias"

const middleware = applyMiddleware(throttle(), promise(), createLogger());

const store = createStore(reducer, defaultInitialState, middleware);
export default store;
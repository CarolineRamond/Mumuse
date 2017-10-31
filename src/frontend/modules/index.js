import { combineReducers } from "redux";

import mediasReducer, { mediasInitialState, mediasMapConfig } from './medias';
import worldReducer, { worldInitialState, worldMapConfig } from './world';
import authReducer from './auth';

const reducer = combineReducers({
	world: worldReducer,
	medias: mediasReducer,
	auth: authReducer
});
export default reducer;

const defaultInitialState = {
	world: worldInitialState,
	medias: mediasInitialState
};

const mapEvents = mediasMapConfig.events.concat(worldMapConfig.events);
const mapDragndrop = mediasMapConfig.dragndrop.concat(worldMapConfig.dragndrop);
const mapRenderedFeatures = mediasMapConfig.renderedFeatures.concat(worldMapConfig.renderedFeatures);
const mapConfig = {
	events: mapEvents,
	dragndrop: mapDragndrop,
	renderedFeatures: mapRenderedFeatures
};

export { defaultInitialState, mapConfig };

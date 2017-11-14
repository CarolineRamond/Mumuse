import { combineReducers } from "redux";

import mediasReducer, { mediasInitialState, mediasMapConfig } from './medias';
import worldReducer, { worldInitialState, worldMapConfig } from './world';
import usersReducer from './users';
import authReducer from './auth';
import rastertilesReducer from './rastertiles';

const reducer = combineReducers({
	world: worldReducer,
	medias: mediasReducer,
	auth: authReducer,
	users: usersReducer,
	rastertiles: rastertilesReducer
});
export default reducer;

const defaultInitialState = {
	world: worldInitialState,
	medias: mediasInitialState
};

const mapEvents = mediasMapConfig.events.concat(worldMapConfig.events);
const mapClicks = mediasMapConfig.click;
const mapDragndrop = mediasMapConfig.dragndrop.concat(worldMapConfig.dragndrop);
const mapRenderedFeatures = mediasMapConfig.renderedFeatures.concat(worldMapConfig.renderedFeatures);
const mapConfig = {
	events: mapEvents,
	click: mapClicks,
	dragndrop: mapDragndrop,
	renderedFeatures: mapRenderedFeatures
};

export { defaultInitialState, mapConfig };

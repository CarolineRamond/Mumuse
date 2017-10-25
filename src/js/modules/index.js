import { combineReducers } from "redux";

import mediasReducer, { mediasInitialState, mediasMapConfig } from './medias';
import worldReducer, { worldInitialState, worldMapConfig } from './world';

const reducer = combineReducers({
	world: worldReducer,
	medias: mediasReducer
});
export default reducer;

const defaultInitialState = {
	world: worldInitialState,
	medias: mediasInitialState
};

const mapEvents = mediasMapConfig.events.concat(worldMapConfig.events);
const mapDragndrop = mediasMapConfig.dragndrop.concat(worldMapConfig.dragndrop);
const mapConfig = {
	events: mapEvents,
	dragndrop: mapDragndrop
};

export { defaultInitialState, mapConfig };

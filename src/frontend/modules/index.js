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

export const getLayersState = (state)=> {
	if (state.rastertiles.pending) {
		return { 
			pending: true,
			error: null,
			data: null
		}
	} else if (state.rastertiles.error) {
		return {
			pending: false,
			error: state.rastertiles.error,
			data: state.medias.layers
		}
	} else {
		return {
			pending: false,
			error: null,
			data: Object.assign({}, state.rastertiles.layers, state.medias.layers)
		}
	}
}

export const getSourcesState = (state)=> {
	if (state.rastertiles.pending) {
		return { 
			pending: true,
			error: null,
			data: null
		}
	} else if (state.rastertiles.error) {
		return {
			pending: false,
			error: state.rastertiles.error,
			data: state.medias.sources
		}
	} else {
		return {
			pending: false,
			error: null,
			data: Object.assign({}, state.rastertiles.sources, state.medias.sources)
		}
	}
}

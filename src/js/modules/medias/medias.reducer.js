import { combineReducers } from 'redux';

import layersReducer from './medias.layers.reducer';
import sourcesReducer from './medias.sources.reducer';

const mediasReducer = (state = {}, action) => {
	switch (action.type) {
		default:
			return Object.assign({}, state, {
				layers: layersReducer(state.layers, action),
				sources: sourcesReducer(state.sources, action)
			});
	}
}

// default export : reducer function
export default mediasReducer;

// other exports : selectors
// (to expose data to components)
export const getVisibleMedias = (state) => {
	const vectorMedias = state.layers["medias-layer"].metadata.renderedFeatures;
	const geoJSONMedias = state.sources["selected-medias-source"].data.features;
	return vectorMedias.concat(geoJSONMedias);
}

export const getSelectedMedias = (state) => {
	return state.sources["selected-medias-source"].data.features;
}

export const getViewportMediaCount = (state) => {
	if (!state.layers["medias-layer"].metadata.isLocked && 
		state.layers["medias-layer"].metadata.renderedFeatures.length > 0) {
		// point layer is visible : return exact media count
		return state.layers["medias-layer"].metadata.renderedFeatures.length +
			state.sources["selected-medias-source"].data.features.length;
	} else {
		// point layer is locked : return grid count (approximative)
		var count = state.layers["grid-medias-layer"].metadata.renderedFeatures.reduce((c, feature)=> {
			return c + feature.properties.allMediaCount;
		}, 0);
		return '~' + count.toString();
	}
}

export const getMediasMinDate = (state) => {
	if (!state.layers["medias-layer"].metadata.isLocked && 
		state.layers["medias-layer"].metadata.renderedFeatures.length > 0) {
		// point layer is visible : return medias min date
		return state.layers["medias-layer"].metadata.renderedFeatures.reduce((min, feature)=> {
			return Math.min(min, new Date(feature.properties.date).getTime());
		}, Date.now());
	} else {
		// point layer is locked : return grid cells min date
		return state.layers["grid-medias-layer"].metadata.renderedFeatures.reduce((min, feature)=> {
			return Math.min(min, new Date(feature.properties.minDate).getTime());
		}, Date.now());
	}
}
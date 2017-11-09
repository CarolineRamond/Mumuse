import { combineReducers } from 'redux';

import layersReducer from './reducers/medias.layers.reducer';
import sourcesReducer from './reducers/medias.sources.reducer';
import timelineReducer from './reducers/medias.timeline.reducer';
import mediasInitialState from './medias.initialState';
import mediasMapConfig from './medias.map.config';

const mediasReducer = combineReducers({
	layers: layersReducer,
	sources: sourcesReducer,
	timeline: timelineReducer,
	mediasUpdate: (state= { justSelected:false, didNbChange: false } , action) => {
		switch(action.type) {
			case 'MEDIAS_CLICK':
				return {
					justSelected: true,
					didNbChange: false
				}
			case 'MEDIAS_UPDATE_FEATURES':
				return {
					justSelected: false,
					didNbChange: !state.justSelected
				}
			default:
				return {
					justSelected: false,
					didNbChange: false
				};
		}
	}
});

// default export : reducer function
export default mediasReducer;

// export initialState & mapInteractions
export { mediasInitialState, mediasMapConfig };

// export selectors
// (to expose data to components)
export const getVisibleMedias = (state) => {
	const vectorMedias = state.layers["medias-layer"].metadata.renderedFeatures;
	const geoJSONMedias = state.sources["selected-medias-source"].data.features.map((feature)=> {
		return Object.assign({}, feature, {
			properties: Object.assign({}, feature.properties, {
				selected: true
			})
		});
	});
	return vectorMedias.concat(geoJSONMedias).sort((a,b)=> {
		return (a.properties._id < b.properties._id);
	});
	// always keep same set of media in same order for carousel display
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

export const getTimelineValue = (state) => {
	return state.timeline;
}

export const didMediasNbChange = (state) => {
	return state.mediasUpdate.didNbChange;
}

export const shouldCarouselReload = (state) => {
	return state.mediasUpdate.didNbChange;
}

export const areMediasLocked = (state) => {
	return state.layers["medias-layer"].metadata.isLocked;
}
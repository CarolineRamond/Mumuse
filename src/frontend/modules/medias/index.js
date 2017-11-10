import { combineReducers } from 'redux';
import { uniq } from "lodash";

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
					selectFilterPending: true,
					didNbChange: false
				}
				break;
			case 'MEDIAS_UPDATE_FEATURES':
				return {
					justSelected: false,
					selectFilterPending: false,
					didNbChange: !state.justSelected
				}
				break;
			default:
				return {
					justSelected: false,
					selectFilterPending: state.selectFilterPending,
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
	console.log('GET VISIBLE MEDIAS ', state.mediasUpdate.selectFilterPending);

	var result;
	const vectorMedias = state.layers["medias-layer"].metadata.renderedFeatures;
	const geoJSONMedias = state.sources["selected-medias-source"].data.features.map((feature)=> {
		return Object.assign({}, feature, {
			properties: Object.assign({}, feature.properties, {
				selected: true
			})
		});
	});

	const tutu = vectorMedias.map((media)=> { return media.properties.name });
	console.log("vector medias : ", tutu.sort());

	// the selection filters are not active yet :
	// deselected medias are not yet added back to vectorMedias => add them
	const justDeselected = state.sources["selected-medias-source"].metadata.justDeselected;
	result = vectorMedias.concat(justDeselected);

	
	const titi = state.sources["selected-medias-source"].metadata.justDeselected.map((media)=> {
		return media.properties.name;
	});

	console.log("+ justDeselected : ", titi.sort());
	console.log("=> ", result.map((media)=> { return media.properties.name }).sort())

	// the selection filters are not active yet :
	// selected medias are not yet removed from vectorMedias => remove them
	// const justSelectedIds = state.sources["selected-medias-source"].metadata.justSelected.map((media)=> {
	// 	return media.properties._id;
	// });
	// result = result.filter((media)=> {
	// 	return (justSelectedIds.indexOf(media.properties._id) === -1);
	// });
	const justSelected = state.sources["selected-medias-source"].metadata.justSelected;
	justSelected.map((media)=> {
		const mediaId = media.properties._id;
		const index = result.findIndex((item)=> {return item.properties._id === mediaId });
		if (index > -1) {
			result.splice(index, 1);
		}
	});
	const toto = state.sources["selected-medias-source"].metadata.justSelected.map((media)=> {
		return media.properties.name;
	});
	console.log("- justSelected : ", toto.sort());
	console.log("=> ", result.map((media)=> { return media.properties.name }).sort())

	

	result = result.concat(geoJSONMedias);
	const juju = geoJSONMedias.map((media)=> { return media.properties.name });
	console.log("+ selected medias : ", juju.sort());
	console.log("=> ", result.map((media)=> { return media.properties.name }).sort())

	// always keep same set of media in same order for carousel display
	result = result.sort((a,b)=> {
		return (a.properties._id < b.properties._id);
	});

	const yoyo = result.map((media)=> {
		return media.properties.name;
	}).sort();
	console.log('result ', yoyo);
	return result;
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

export const justSelectedMedias = (state) => {
	return state.mediasUpdate.justSelected;
}

export const areMediasLocked = (state) => {
	return state.layers["medias-layer"].metadata.isLocked;
}
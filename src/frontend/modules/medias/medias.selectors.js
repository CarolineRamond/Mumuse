export const getVisibleMedias = (state) => {
	const vectorMedias = state.sources["medias-source"].metadata.renderedFeatures
		.map((feature)=> {
			var featureClone = Object.assign( Object.create( Object.getPrototypeOf(feature)), feature)
			featureClone.properties.selected = false;
			return featureClone;
		});
	const selectedIds = state.sources["selected-medias-source"].data.features.map((feature)=> {
		return feature.properties._id;
	});

	var result;
	if (state.sources["selected-medias-source"].metadata.selectFilterPending) {
		const stillFiltered = state.sources["selected-medias-source"].metadata.stillFiltered
			.map((feature)=> {
				var featureClone = Object.assign( Object.create( Object.getPrototypeOf(feature)), feature)
				featureClone.properties.selected = false;
				return featureClone;
			});
		result = vectorMedias.concat(stillFiltered);
	} else {
		const selectedFeatures = state.sources["selected-medias-source"].data.features
			.map((feature)=> {
				return Object.assign( Object.create( Object.getPrototypeOf(feature)), feature)
			});
		result = vectorMedias.concat(selectedFeatures);
	}
	
	result = result
		.map((item)=> {
			if (selectedIds.indexOf(item.properties._id) > -1) {
				item.properties.selected = true;
			}
			return item;
		}).sort((a,b)=> {
			if (a.properties.date === b.properties.date) {
				if (a.properties.name) {
					return a.properties.name.localeCompare(b.properties.name);
				} else {
					return 1;
				}
			}
			return (a.properties.date - b.properties.date);
		});

	return result;
}

export const getSelectedMedias = (state) => {
	return state.sources["selected-medias-source"].data.features;
}

export const getViewportMediaCount = (state) => {
	if (!state.layers["medias-layer"].metadata.isLocked && 
		state.sources["medias-source"].metadata.renderedFeatures.length > 0) {
		// point layer is visible : return exact media count
		return state.sources["medias-source"].metadata.renderedFeatures.length +
			state.sources["selected-medias-source"].data.features.length;
	} else {
		// point layer is locked : return grid count (approximative)
		var count = state.sources["grid-medias-source"].metadata.renderedFeatures.reduce((c, feature)=> {
			return c + feature.properties.allMediaCount;
		}, 0);
		return '~' + count.toString();
	}
}

export const getMediasMinDate = (state) => {
	if (!state.layers["medias-layer"].metadata.isLocked && 
		state.sources["medias-source"].metadata.renderedFeatures.length > 0) {
		// point layer is visible : return medias min date
		return state.sources["medias-source"].metadata.renderedFeatures.reduce((min, feature)=> {
			return Math.min(min, new Date(feature.properties.date).getTime());
		}, Date.now());
	} else {
		// point layer is locked : return grid cells min date
		return state.sources["grid-medias-source"].metadata.renderedFeatures.reduce((min, feature)=> {
			return Math.min(min, new Date(feature.properties.minDate).getTime());
		}, Date.now());
	}
}

export const getTimelineValue = (state) => {
	return state.timeline;
}

export const getSelectFilterPending = (state) => {
	return state.sources["selected-medias-source"].metadata.selectFilterPending;
}

export const areMediasLocked = (state) => {
	return state.layers["medias-layer"].metadata.isLocked;
}

export const getUploadMediasState = (state)=> {
	return state.uploadMedias;
}

export const getDeleteMediasState = (state)=> {
	return state.deleteMedias;
}

export const getLayersState = (state) => {
	return {
		pending: false,
		error: null,
		data: state.layers
	}
}

export const getSourcesState = (state) => {
	return {
		pending: false,
		error: null,
		data: state.sources
	}
}
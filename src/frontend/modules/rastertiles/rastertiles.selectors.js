import { forIn } from "lodash";

export const getRasterLayersInBounds = (state)=> {
	var result = {};
	forIn(state.layers, (layer, layerId)=> {
		if (layer.metadata.isInBounds) {
			result[layerId] = layer;
		}
	});
	return result;
}

export const getLayersState = (state) => {
	return {
		pending: state.pending,
		error: state.error,
		data: state.layers
	}
}

export const getSourcesState = (state) => {
	return {
		pending: state.pending,
		error: state.error,
		data: state.sources
	}
}
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
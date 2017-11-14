import axios from "axios";

export const fetchRastertilesets = ()=> {
	return { 
		type: 'FETCH_RASTERTILESETS', 
		payload: axios.get('/map/rastertile')
	};
};

export const toggleRastertileset = (layerId)=> {
	return {
		type: 'TOGGLE_RASTERTILESETS',
		payload: {
			layerId: layerId
		}
	};
}

export const updateVisibleRastertilesets = (layerIds)=> {
	return {
		type: 'UPDATE_VISIBLE_RASTERTILESETS',
		payload: {
			layerIds: layerIds
		}
	}
}







import { combineReducers } from "redux";
import mediasReducer from './medias/medias.reducer.js';
// import sitesReducer from './sites/sites.reducer.js';
import worldReducer from './map/world';

import mediasMapResource from './medias/medias.map.resource';
// import sitesMapResource from './sites/sites.map.resource';

const reducer = combineReducers({
	world: worldReducer,
	mapResources: combineReducers({
		medias: mediasReducer,
		// sites: sitesReducer
	})
});

const mapResources =  {
	medias: mediasMapResource,
	// sites: sitesMapResource
};

export { reducer, mapResources }
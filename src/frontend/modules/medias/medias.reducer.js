import { combineReducers } from 'redux';

import layersReducer from './reducers/medias.layers.reducer';
import sourcesReducer from './reducers/medias.sources.reducer';
import timelineReducer from './reducers/medias.timeline.reducer';
import uploadMediasReducer from './reducers/medias.uploadMedias.reducer';
import deleteMediasReducer from './reducers/medias.deleteMedias.reducer';

const mediasReducer = combineReducers({
	layers: layersReducer,
	sources: sourcesReducer,
	timeline: timelineReducer,
	selectFilterPending: (state= false , action) => {
		switch(action.type) {
			case "MEDIAS_CLICK":
			case "MEDIAS_SELECT_BY_ID":
				return true;
				break;
			case "MEDIAS_UPDATE_FEATURES":
				return false;
				break;
			default:
				return state;
				break;
		}
	},
	uploadMedias: uploadMediasReducer,
	deleteMedias: deleteMediasReducer
});

// default export : reducer function
export default mediasReducer;
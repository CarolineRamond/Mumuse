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
	uploadMedias: uploadMediasReducer,
	deleteMedias: deleteMediasReducer
});

// default export : reducer function
export default mediasReducer;

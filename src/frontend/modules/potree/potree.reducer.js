import { combineReducers } from 'redux';
import layersReducer from './reducers/pointclouds.layers.reducer';
import sourcesReducer from './reducers/pointclouds.sources.reducer';

const potreeReducer = combineReducers({
    layers: layersReducer,
    sources: sourcesReducer
});

// default export : reducer function
export default potreeReducer;

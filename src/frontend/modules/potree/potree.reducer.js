import { combineReducers } from 'redux';
import layersReducer from './reducers/pointclouds.layers.reducer';
import sourcesReducer from './reducers/pointclouds.sources.reducer';
import pointCloudReducer from './reducers/potree.reducer';

const potreeReducer = combineReducers({
    layers: layersReducer,
    sources: sourcesReducer,
    pointCloud: pointCloudReducer
});

// default export : reducer function
export default potreeReducer;

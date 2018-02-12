import { combineReducers } from 'redux';
import layersReducer from './reducers/pointclouds.layers.reducer';
import sourcesReducer from './reducers/pointclouds.sources.reducer';
import pointCloudReducer from './reducers/potree.reducer';

const defaultReducer = combineReducers({
    layers: layersReducer,
    sources: sourcesReducer,
    pointCloud: pointCloudReducer
});

const potreeReducer = (state, action) => {
    switch (action.type) {
        case 'MEDIAS_CLICK':
            // a media was clicked : if it is linked to a point cloud,
            // it should be selected
            const pointCloudId = action.payload.features.reduce((value, feature) => {
                if (feature.properties.potreedataSet) {
                    return feature.properties.potreedataSet;
                } else {
                    return value;
                }
            }, null);
            if (pointCloudId) {
                console.log('FOUND POINT CLOUD ID : ', pointCloudId);
                console.log(state);
                // const pointCloud = state.sources['pointClouds-source'].data.features.find(
                //     feature => {
                //         return feature.properties._id === pointCloudId;
                //     }
                // );
                // console.log(pointCloud);
                return defaultReducer(state, action);
            } else {
                return defaultReducer(state, action);
            }
        default:
            return defaultReducer(state, action);
    }
};

// default export : reducer function
export default potreeReducer;

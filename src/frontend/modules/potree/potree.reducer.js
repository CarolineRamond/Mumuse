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
        case 'POINTCLOUD_CLICK': {
            const pointCloudFeatures = [];
            const mediaFeatures = [];
            action.payload.features.map(feature => {
                if (feature.layer.id === 'pointClouds-layer') {
                    pointCloudFeatures.push(feature);
                } else {
                    mediaFeatures.push(feature);
                }
            });
            let pointCloud = null;
            if (pointCloudFeatures.length > 0) {
                // case 1 : a pointcloud is clicked
                pointCloud = pointCloudFeatures[0];
            } else if (mediaFeatures.length > 0) {
                // case 2 : some medias are clicked : check if
                // at least on of them is linked to a pointCloud
                const pointCloudId = mediaFeatures.reduce((id, feature) => {
                    return feature.properties.potreedataSet || id;
                }, null);
                if (pointCloudId) {
                    pointCloud = state.sources['pointClouds-source'].metadata.renderedFeatures.find(
                        item => {
                            return item.properties._id.toString() === pointCloudId.toString();
                        }
                    );
                }
            }
            action.payload.pointCloud = pointCloud;
            return defaultReducer(state, action);
        }
        default: {
            return defaultReducer(state, action);
        }
    }
};

// default export : reducer function
export default potreeReducer;

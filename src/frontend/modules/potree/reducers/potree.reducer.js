const potreeReducer = (state = null, action) => {
    switch (action.type) {
        case 'POINTCLOUD_CLICK': {
            let pointCloud;
            if (action.payload.features.length) {
                pointCloud = Object.assign({}, state, {
                    metaData: action.payload.features.length
                        ? action.payload.features[0].properties
                        : null
                });
            } else {
                pointCloud = null;
            }
            return pointCloud;
        }
        case 'POINTCLOUD_INIT_SELECTED_FULFILLED': {
            const metaData = action.payload.data.properties ? action.payload.data.properties : null;
            if (metaData && metaData.visus) {
                metaData.visus = JSON.stringify(metaData.visus);
            }
            const pointCloud = Object.assign({}, state, {
                metaData: metaData
            });
            return pointCloud;
        }
        default:
            return state;
    }
};

export default potreeReducer;

const potreeReducer = (state = null, action) => {
    switch (action.type) {
        case 'POINTCLOUD_CLICK': {
            if (action.payload.pointCloud) {
                return {
                    ...state,
                    metaData: action.payload.pointCloud.properties
                };
            } else {
                return null;
            }
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

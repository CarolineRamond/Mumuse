/** This will retrieve pointcloud-related layers state.
 */
export const getLayersState = state => {
    return {
        pending: false,
        error: null,
        data: state.layers
    };
};

/** This will retrieve pointcloud-related sources state.
 */
export const getSourcesState = state => {
    return {
        pending: false,
        error: null,
        data: state.sources
    };
};

/** This will retrieve the currently selected pointcloud.
 */
export const getSelectedPointCloud = state => {
    return state.sources['pointClouds-source'].data.features.find(feature => {
        return feature.properties._isSelected;
    });
};

/** This will retrieve the currently visible pointclouds (ie pointclouds in map bounds).
 */
export const getVisiblePointClouds = state => {
    return state.sources['pointClouds-source'].data.features.filter(feature => {
        return feature.properties._isInBounds;
    });
};

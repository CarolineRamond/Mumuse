export const getLayersState = state => {
    return {
        pending: false,
        error: null,
        data: state.layers
    };
};

export const getSourcesState = state => {
    return {
        pending: false,
        error: null,
        data: state.sources
    };
};

export const getSelectedPointCloud = state => {
    return state.pointCloud;
};

export const getVisiblePointClouds = state => {
    return state.sources['pointClouds-source'].metadata.renderedFeatures;
};

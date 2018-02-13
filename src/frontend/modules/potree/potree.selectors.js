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
    return state.sources['pointClouds-source'].data.features.find(feature => {
        return feature.properties._isSelected;
    });
};

export const getVisiblePointClouds = state => {
    return state.sources['pointClouds-source'].data.features.filter(feature => {
        return feature.properties._isInBounds;
    });
};

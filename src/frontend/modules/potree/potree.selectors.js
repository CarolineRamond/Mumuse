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
    return state.sources['pointClouds-source'].metadata.renderedFeatures.map(feature => {
        const currentFilter = state.layers['pointClouds-layer'].filter;
        const filteredIds = currentFilter[1].slice(2, currentFilter[1].length) || [];
        return {
            ...feature,
            properties: {
                ...feature.properties,
                visus: undefined
            },
            metadata: {
                isShown: filteredIds.indexOf(feature.properties._id) === -1
            }
        };
    });
};

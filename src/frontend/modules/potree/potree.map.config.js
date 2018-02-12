import { clickPointCloud, updateFeaturesPointCloud } from './potree.actions';

export default {
    click: [
        {
            layerIds: ['pointClouds-layer'],
            action: clickPointCloud
        }
    ],
    dragndrop: [],
    renderedFeatures: [
        {
            shouldQueryOnSource: true,
            layerIds: ['pointClouds-layer'],
            source: 'pointClouds-source',
            uniqueKey: '_id',
            action: updateFeaturesPointCloud
        }
    ],
    events: []
};

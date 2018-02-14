import { clickPointCloud } from './potree.actions';

export default {
    click: [
        {
            layerIds: ['pointClouds-layer', 'medias-layer'],
            action: clickPointCloud
        }
    ],
    dragndrop: [],
    renderedFeatures: [],
    events: []
};

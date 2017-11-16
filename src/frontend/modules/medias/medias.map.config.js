import { clickMedias, deselectMapMedias, 
    startDragMapMedias, dragMapMedias, endDragMapMedias, 
    updateFeaturesMedias, updateFeaturesGridMedias } from './medias.actions';

export default {
    click: [{
        layerIds: ["medias-layer"],
        action: clickMedias
    }],
    dragndrop: [{
        layerId: "selected-medias-layer",
        mousedown: startDragMapMedias,
        mousemove: dragMapMedias,
        mouseup: endDragMapMedias
    }],
    renderedFeatures: [{
        layerIds: ["medias-layer"],
        source: "medias-source",
        uniqueKey: "_id",
        action: updateFeaturesMedias
    }, {
        layerIds: ["grid-medias-layer"],
        source: "grid-medias-source",
        uniqueKey: "quadkey",
        action: updateFeaturesGridMedias
    }],
    events: []
}
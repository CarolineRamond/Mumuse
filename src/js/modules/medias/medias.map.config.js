import { selectMapMedias, deselectMapMedias, startDragMapMedias, dragMapMedias, endDragMapMedias } from './medias.actions';

export default {
    // events contain all event handlers except dragndrop
    // events listeners are added sequentially on map load
    // dragndrop listeners are set up another way (cf Map component)
    events: [{
        type: 'click',
        layer: null,
        action: deselectMapMedias
    }, 
    {
        type: 'click',
        layerId: "medias-layer",
        action: selectMapMedias
    }],
    dragndrop: [{
        layerId: "selected-medias-layer",
        mousedown: startDragMapMedias,
        mousemove: dragMapMedias,
        mouseup: endDragMapMedias
    }]
}
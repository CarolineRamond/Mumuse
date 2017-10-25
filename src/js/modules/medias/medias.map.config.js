import { selectMedias, deselectMedias, startDragMedias, dragMedias, endDragMedias } from './medias.actions';

export default {
    // events contain all event handlers except dragndrop
    // events listeners are added sequentially on map load
    // dragndrop listeners are set up another way (cf Map component)
    events: [{
        type: 'click',
        layer: null,
        action: function (event) {
            return deselectMedias(event);
        }
    }, 
    {
        type: 'click',
        layerId: "medias-layer",
        action: function (event) {
           return selectMedias(event);
        }
    }],
    dragndrop: [{
        layerId: "selected-medias-layer",
        mousedownAction: function (event) {
            return startDragMedias(event);
        },
        mousemoveAction: function (event) {
            return dragMedias(event);
        },
        mouseupAction: function (event) {
            return endDragMedias(event);
        }
    }]
}
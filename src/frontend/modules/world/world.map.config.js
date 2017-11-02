import { updateWorldState } from './world.actions';

export default {
    // events contain all event handlers except dragndrop
    // events listeners are added sequentially on map load
    // dragndrop listeners are set up another way (cf Map component)
    events: [],
    dragndrop: [],
    renderedFeatures: []
}
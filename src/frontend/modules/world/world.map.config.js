import { updateWorldState } from './world.actions';

export default {
    events: [{
    	type: 'moveend',
        layer: null,
        action: updateWorldState
    }],
    dragndrop: [],
    renderedFeatures: []
}
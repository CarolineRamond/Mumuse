import * as actions from './medias.actions' ;

export default {
    sources: {
        "medias-source": {
            type: "vector",
            tiles: ['http://localhost:8080/userdrive/tile/{z}/{x}/{y}.pbf']
        },
        "grid-medias-source": {
            type: "vector",
            tiles: ['http://localhost:8080/userdrive/tile/grid/{z}/{x}/{y}.pbf']
        },
        "selected-medias-source": {
            type: "geojson",
            data: { 
                type: "FeatureCollection",
                features: []
            }
        }
    },
    layers: {
        "medias-layer": {
            id: "medias-layer",
            type: "circle",
            source: "medias-source",
            "source-layer": "user-space-tile-media-source",
            layout: {
               visibility: "visible"
            },
            paint: {
               "circle-radius": 7,
               "circle-color": "red"
            },
            filter: [ 'all', ['has', 'loc'] ],
            minzoom: 13,
            maxzoom: 24,
            metadata: {
                isLocked: true,
                isShown: false,
                wasShownBeforeLock: true,
                renderedFeatures: []
            }
        },
        "grid-medias-layer": {
            id: "grid-medias-layer",
            type: "fill",
            source: "grid-medias-source",
            "source-layer": "user-space-grid-tile-media-source",
            layout: {
               visibility: "visible"
            },
            paint: {
                "fill-color": '#c53a4f',
                "fill-outline-color": 'rgba(0, 0, 0, 0.3)',
                "fill-opacity": {
                    "property": "allMediaOpacity",
                    "type": "exponential",
                    "stops" : [
                        [0, 0],
                        [1, 0.2],
                        [100, 0.8]
                    ]
                }
            },
            metadata: {
                isLocked: false,
                isShown: false,
                wasShownBeforeLock: false,
                renderedFeatures: []
            }
        },
        "selected-medias-layer": {
            id: "selected-medias-layer",
            type: "circle",
            source: "selected-medias-source",
            layout: {
               visibility: "visible"
            },
            paint: {
               "circle-radius": 8,
               "circle-color": "blue"
            },
            metadata: {
                isLocked: false,
                isShown: false,
                wasShownBeforeLock: false
            }
        }
    },
    // events contain all event handlers except dragndrop
    // events listeners are added sequentially on map load
    // dragndrop listeners are set up another way (cf Map component)
    events: [{
        type: 'click',
        layer: null,
        action: function (event) {
            return { type: 'DESELECT_MEDIAS', payload: { ctrlKey: event.originalEvent.ctrlKey  } }
        }
    }, 
    {
        type: 'click',
        layerId: "medias-layer",
        action: function (event) {
            console.log('SELECT MEDIA ', event);
           return { type: 'SELECT_MEDIA', payload: { features: event.features, ctrlKey: event.originalEvent.ctrlKey } }
        }
    }],
    dragndrop: {
        "selected-medias-layer": {
            mousedownAction: function (event) {
                return { type: 'START_DRAG_MEDIA', payload: { features: event.features } }
            },
            mousemoveAction: function (event) {
                return { type: 'DRAG_MEDIA', payload: { coords: event.lngLat } }
            },
            mouseupAction: function (event) {
                return { type: 'END_DRAG_MEDIA' }
            },
            draggingFeatureId: null
        }
    }
}
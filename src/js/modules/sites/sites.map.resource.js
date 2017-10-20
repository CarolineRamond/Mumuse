import * as actions from './sites.actions' ;

export default {
	sources: {
        "sites-source": {
            type: "geojson",
            data: {
                type: "FeatureCollection",
                features: [{
                    type: "Feature",
                    geometry: {
                        type: "Point",
                        coordinates: [-76.03238902390978, 37.913189059745586]
                    },
                    properties: {
                        _id: 1,
                        title: "Site 1",
                        selected: false
                    }
                }, {
                    type: "Feature",
                    geometry: {
                        type: "Point",
                        coordinates: [-121.414, 36.776]
                    },
                    properties: {
                        _id: 2,
                        title: "Site 2",
                        selected: false
                    }
                }]
            }
        }
    },
    layers: {
        "sites-layer": {
            id: "sites-layer",
            type: "circle",
            source: "sites-source",
            layout: {
               visibility: "visible"
            },
            paint: {
               "circle-radius": 7,
               "circle-color": {
                   property: "selected",
                   type: "categorical",
                   stops: [[false, "orange"], [true, "green"]],
                   default: "#c53a4f"
               }
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
            return { type: 'DESELECT_SITES' }
        }
    }, 
    {
        type: 'click',
        layerId: "sites-layer",
        action: function (event) {
           return { type: 'SELECT_SITE', payload: { features: event.features } }
        }
    }],
    dragndrop: {
        "sites-layer": {
            mousedownAction: function (event) {
                return { type: 'START_DRAG_SITE', payload: { features: event.features } }
            },
            mousemoveAction: function (event) {
                return { type: 'DRAG_SITE', payload: { coords: event.lngLat } }
            },
            mouseupAction: function (event) {
                return { type: 'END_DRAG_SITE' }
            },
            draggingFeatureId: null
        }
    },
    viewportcount: {
        layerIds: ["sites-layer"],
        sourceId: "sites-source",
        uniqueKey: "_id",
        value: 0,
        action: function (count) {
            return { type: 'UPDATE_SITE_VIEWPORT_COUNT', payload: { count } }
        }
    }
}
import { applyMiddleware, createStore } from "redux"

import logger from "redux-logger"
import promise from "redux-promise-middleware"
import reducer from "./reducers"

const middleware = applyMiddleware(promise(), logger())
const initialState = {
	world: {
        lat: 37.8,
	    long: -96,
	    zoom: 3
    },
    medias: {
        source: {
            id: "medias-source",
            didChange: false,
            type: "geojson",
            data: {
                type: "FeatureCollection",
                features: [{
                    type: "Feature",
                    geometry: {
                        type: "Point",
                        coordinates: [-77.03238901390978, 38.913188059745586]
                    },
                    properties: {
                        _id: 1,
                        title: "Mapbox DC",
                        icon: "monument",
                        selected: false
                    }
                }, {
                    type: "Feature",
                    geometry: {
                        type: "Point",
                        coordinates: [-122.414, 37.776]
                    },
                    properties: {
                        _id: 2,
                        title: "Mapbox SF",
                        icon: "harbor",
                        selected: false
                    }
                }]
            }
        },
        layers: [{
            id: "medias-layer",
            type: "circle",
            source: "medias-source",
            layout: {
               visibility: "visible"
            },
            paint: {
               "circle-radius": 7,
               "circle-color": {
                   property: "selected",
                   type: "categorical",
                   stops: [[false, "red"], [true, "blue"]],
                   default: "#c53a4f"
               }
            },
            didChange: {
                paint: false,
                layout: false
            }
        }],
        interactions: {
            // events contain all event handlers except dragndrop
            // events listeners are added sequentially on map load
            // dragndrop listeners are set up another way (cf Map component)
            events: [{
                type: 'click',
                layer: null,
                action: function (event) {
                    return { type: 'DESELECT_MEDIAS' }
                }
            }, 
            {
                type: 'click',
                layerId: "medias-layer",
                action: function (event) {
                   return { type: 'SELECT_MEDIA', payload: { features: event.features } }
                }
            }],
            dragndrop: {
                "medias-layer": {
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
	},
    sites: {
        source: {
            id: "sites-source",
            didChange: false,
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
                        title: "Mapbox DC",
                        icon: "monument",
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
                        title: "Mapbox SF",
                        icon: "harbor",
                        selected: false
                    }
                }]
            }
        },
        layers: [{
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
            },
            didChange: {
                paint: false,
                layout: false
            }
        }],
        interactions: {
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
            }
        }
    }
}
export default createStore(reducer, initialState, middleware)

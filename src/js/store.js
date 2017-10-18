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
        layer: {
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
            } 
        },
        events: [{ 
            type: 'click', 
            layerId: null, 
            action: function (event) {
                return { type: 'DESELECT_MEDIAS' }
            }
        }, {
            type: 'click', 
            layerId: "medias-layer", 
            action: function (event) {
               return { type: 'SELECT_MEDIA', payload: { features: event.features } }
            }
        }],
        dragndrop: {
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
        },
        didChange: {
            source: false,
            layer: false
        }
	}
}
export default createStore(reducer, initialState, middleware)

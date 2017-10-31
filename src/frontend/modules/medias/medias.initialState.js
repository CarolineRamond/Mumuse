export default {
    sources: {
        "medias-source": {
            type: "vector",
            tiles: ['http://localhost:8081/userdrive/tile/{z}/{x}/{y}.pbf']
        },
        "grid-medias-source": {
            type: "vector",
            tiles: ['http://localhost:8081/userdrive/tile/grid/{z}/{x}/{y}.pbf']
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
                name: "Medias",
                isLocked: true,
                isShown: false,
                wasShownBeforeLock: true,
                renderedFeatures: [],
                featureKey: "_id"
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
            minzoom: 0,
            maxzoom: 24,
            metadata: {
                name: "Medias Grid",
                isLocked: false,
                isShown: true,
                wasShownBeforeLock: true,
                renderedFeatures: [],
                featureKey: "quadkey"
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
                name: "Selected Medias",
                isLocked: false,
                isShown: true,
                wasShownBeforeLock: true
            }
        }
    }
}
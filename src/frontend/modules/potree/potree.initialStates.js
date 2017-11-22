export default {
    sources: {
        "pointClouds-source": {
            type: "geojson",
            data: 'http://localhost:8080/potreeviewer/potreedataset',
            metadata: {
                didChange: false,
                selectFilterPending: false,
                stillFiltered: []
            }
        }
    },
    layers: {
        "pointClouds-layer": {
            id: "pointClouds-layer",
            type: "fill",
            source: "pointClouds-source",
            layout: {
                visibility: "visible"
            },
            paint: {
                'fill-outline-color': '#22a37a ',
                'fill-color': '#22a37a ',
                'fill-opacity': 0.3
            },
            metadata: {
                name: "Pointcloud",
                isLocked: false,
                isShown: true,
                wasShownBeforeLock: true
            }
        }
    }
}
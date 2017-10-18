import React from "react";
import _ from "lodash";
import { connect } from "react-redux"
import mapboxgl from "mapbox-gl"
import 'mapbox-gl/dist/mapbox-gl.css'
mapboxgl.accessToken = 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA';

import '../../css/map.css'
import { updateWorldState } from '../actions/world.actions';

// this is to set up component's props
// component's props will be an excerpt
// of the store
// + some functions like dispatch (to fire actions)
@connect((store)=> {
	var sources = [];
	var layers = [];
	var events = [];
	var dragndrop = {};
	_.forIn(store, (item, key)=> {
		if (item.source) {
			sources = sources.concat(item.sources);
		}
		if (item.layers) {
			layers = layers.concat(item.layers);
		}
		if (item.interactions && item.interactions.events) {
			events = events.concat(item.interactions.events);
		}
		if (item.interactions && item.interactions.dragndrop) {
			dragndrop = _.extend(dragndrop, item.interactions.dragndrop);
		}
	});
	return {
		world: store.world,
		layers: layers,
		sources: sources,
		events: events,
		// dragndrop: store.medias.dragndrop,
		didChange: store.medias.didChange
	}
})

export default class Map extends React.Component {

	componentDidMount() {
		const { lat, long, zoom } = this.props.world;
		this.map = new mapboxgl.Map({
			container: this.mapContainer,
			style: 'mapbox://styles/mapbox/light-v9',
			center: [long, lat],
			zoom: zoom
		});
		this.isDragging = false;
		this.draggingFeatureId;

		this.map.on('load', ()=> {
			// load sources
			this.props.sources.map((source)=>{
				const sourceId = source.id;
				delete source.id;
				this.map.addSource(sourceId, source);
			});
		
			// load layers
			this.props.layers.map((layer)=> {
				this.map.addLayer(layer);
			})

			// add event handlers
			this.props.events.map((event)=> {
				if (event.layerId) {
					this.map.on(event.type, event.layerId, (evt)=> {
						this.props.dispatch(event.action(evt));
					});
				} else {
					this.map.on(event.type, (evt)=> {
						this.props.dispatch(event.action(evt));
					});
				}
			});

			// add dragndrop handling
			_.forIn(dragndrop, (handlers, layerId)=> {
				// disable/enable map panning
				// on enter/leave layer
				this.map.on('mouseenter', layerId, (evt)=> {
					this.map.dragPan.disable();
				});
				this.map.on('mouseleave', layerId, (evt)=> {
					this.map.dragPan.enable();
				});

				// detect mousedown on layer, setup mouseup event (once)
				// and dispatch corresponding action
				this.map.on('mousedown', layerId, (evt)=> {
					this.props.dispatch(handlers.mousedownAction(evt));
					this.isDragging = true;
					this.draggingFeatureId = evt.features[0].properties._id;

					this.map.once('mouseup', (evt)=> {
						this.props.dispatch(handlers.mouseupAction(evt));
						this.draggingFeatureId = null;
						this.isDragging = false;
					});
				});

				// this.map.on('mousemove', (evt)=> {
				// 	if (this.isDragging) {
				// 		this.props.dispatch(this.props.dragndrop.mousemoveAction(evt));
				// 	}
				// });
			});			
		});

		// add moveend handler : to change world's properties
		this.map.on('moveend', ()=> {
			const { lng, lat } = this.map.getCenter();
			this.props.dispatch(updateWorldState({
				long: lng,
				lat: lat,
				zoom: this.map.getZoom(),
			}));
		});
	}

	componentWillReceiveProps(nextProps) {
		// reload map sources that have changed
		// &/or repaint map layers that have changed
		if (nextProps.didChange.source) {
			this.map.getSource("medias-source").setData(nextProps.source.data);
		}
	}

	render() {
		return <div>
			<div className="map" ref={el => this.mapContainer = el}></div>
		</div>
	}
}

function getUniqueFeatures(array, comparatorProperty) {
    var existingFeatureKeys = {};
    // Because features come from tiled vector data, feature geometries may be split
    // or duplicated across tile boundaries and, as a result, features may appear
    // multiple times in query results.
    var uniqueFeatures = array.filter(function(el) {
        if (existingFeatureKeys[el.properties[comparatorProperty]]) {
            return false;
        } else {
            existingFeatureKeys[el.properties[comparatorProperty]] = true;
            return true;
        }
    });
    return uniqueFeatures;
}
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
	return {
		world: store.world,
		layer: store.medias.layer,
		source: store.medias.source,
		events: store.medias.events,
		dragndrop: store.medias.dragndrop,
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
			// load source
			const sourceId = this.props.source.id;
			delete this.props.source.id;
			this.map.addSource(sourceId, this.props.source);
		
			// load layer
			this.map.addLayer(this.props.layer);

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

			this.map.on('mouseenter', this.props.layer.id, (evt)=> {
				this.map.dragPan.disable();
			});

			this.map.on('mouseleave', this.props.layer.id, (evt)=> {
				this.map.dragPan.enable();
			});

			this.map.on('mousedown', this.props.layer.id, (evt)=> {
				this.props.dispatch(this.props.dragndrop.mousedownAction(evt));
				this.isDragging = true;
				this.draggingFeatureId = evt.features[0].properties._id;

				this.map.once('mouseup', (evt)=> {
					this.props.dispatch(this.props.dragndrop.mouseupAction(evt));
					this.draggingFeatureId = null;
					this.isDragging = false;
				});
			});

			this.map.on('mousemove', (evt)=> {
				if (this.isDragging) {
					this.props.dispatch(this.props.dragndrop.mousemoveAction(evt));
				}
			});
		});

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
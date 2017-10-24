import React from "react";
import _ from "lodash";
import { connect } from "react-redux"
import mapboxgl from "mapbox-gl"
import 'mapbox-gl/dist/mapbox-gl.css'
mapboxgl.accessToken = 'pk.eyJ1IjoiaWNvbmVtIiwiYSI6ImNpbXJycDBqODAwNG12cW0ydGF1NXZxa2sifQ.hgPcQvgkzpfYkHgfMRqcpw';

import '../../css/map.css'
import { updateWorldState } from '../modules/world/world.actions';

// this is to set up component's props
// component's props will be an excerpt
// of the store
// + some functions like dispatch (to fire actions)
@connect((store)=> {
	var sources = {};
	var layers = {};
	var events = [];
	var dragndrop = {};

	_.forIn(store.mapResources, (item, key)=> {
		if (item.sources) {
			sources = _.extend(sources, item.sources);
		}
		if (item.layers) {
			layers = _.extend(layers, item.layers);
		}
		if (item.events) {
			events = events.concat(item.events);
		}
		if (item.dragndrop) {
			dragndrop = _.extend(dragndrop, item.dragndrop);
		}
	});
	return {
		world: store.world,
		layers: layers,
		sources: sources,
		events: events,
		dragndrop: dragndrop
	}
})

export default class Map extends React.Component {

	componentDidMount() {
		const { lat, long, zoom } = this.props.world;
		this.map = new mapboxgl.Map({
			container: this.mapContainer,
			style: 'mapbox://styles/iconem/cio487j79006hc7m7wu00w6hw',
			center: [long, lat],
			zoom: zoom,
			renderWorldCopies: false,
			maxBounds: [[-180, -85], [180, 85]],
			transformRequest: (url, resourceType) => {
				if (url.match(/\/userdrive\/tile\/grid\/\d+\/\d+\/\d+.pbf$/)) {
                    var bounds = this.map.getBounds().toArray().toString();
                    return {
                        url: url + '/?viewport=' + bounds
                    };
                }
			}
		});
		this.draggingLayerId = null;

		this.map.on('load', ()=> {
			this._loadSources();
			this._loadLayers();
			this._addSimpleEventsHandling();
			this._addDragndropHandling();
			this._addViewportChangeHandling();
		});
	}

	componentWillReceiveProps(nextProps) {
		this._reloadSourcesData(nextProps);
		this._updateLayersStyle(nextProps);
	}

	shouldComponentUpdate() {
		// React does not need to re-render map component
		// (mapbox will still re-render this.map)
		return false;
	}

	render() {
		return <div>
			<div className="map" ref={el => this.mapContainer = el}></div>
		</div>
	}

	_loadSources() {
		_.forIn(this.props.sources, (source, sourceId)=>{
			this.map.addSource(sourceId, source);
		});
	}

	_loadLayers() {
		_.forIn(this.props.layers, (layer, layerId)=> {
			this.map.addLayer(layer);
		});
	}

	_addSimpleEventsHandling() {
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
	}

	_addDragndropHandling() {
		_.forIn(this.props.dragndrop, (handlers, layerId)=> {
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
				this.draggingLayerId = layerId;

				this.map.once('mouseup', (evt)=> {
					this.props.dispatch(handlers.mouseupAction(evt));
					this.draggingLayerId = null;
				});
			});
		});	

		// add mousemove listener only if one of the layers
		// has dragndrop interaction
		if (Object.keys(this.props.dragndrop).length > 0) {
			this.map.on('mousemove', (evt)=> {
				if (this.draggingLayerId) {
					var handlers = this.props.dragndrop[this.draggingLayerId];
					this.props.dispatch(handlers.mousemoveAction(evt));
				}
			});
		}
	}

	_addViewportChangeHandling() {
		// update world on move end
		this.map.on('moveend', ()=> {
			const { lng, lat } = this.map.getCenter();
			this.props.dispatch(updateWorldState({
				long: lng,
				lat: lat,
				zoom: this.map.getZoom(),
			}));
		});

		// set up events to update viewport counts
		// (and dispatch actions) when needed
		_.forIn(this.props.layers, (layer)=> {
			if (layer.metadata && layer.metadata.renderedFeatures) {
				const getRenderedFeatures = ()=> {
					const renderedFeatures = getUniqueFeatures(
						this.map.queryRenderedFeatures({ layers: [layer.id] }),
						layer.metadata.featureKey
					);
					this.props.dispatch(updateRenderedFeatures(layer.id, renderedFeatures, this.map.getZoom()));
				}
				const renderHandler = (data)=> {
					if (this.map.isStyleLoaded() && this.map.isSourceLoaded(layer.source)) {
						getRenderedFeatures();
						this.map.off('render', renderHandler);
					}
				}

				// on init : wait for a map rendering
				// that displays item's source and layer
				// once this rendering is done,
				// update viewport count and cancels render listener
				this.map.on('render', renderHandler);

				// on map moveend : idem init
				this.map.on('moveend', ()=> {
					this.map.on('render', renderHandler);
				});
			}
		});
	}

	_reloadSourcesData(nextProps) {
		_.forIn(nextProps.sources, (source, sourceId)=> {
			if (source.didChange) {
				this.map.getSource(sourceId).setData(source.data);
			}
		});
	}

	_updateLayersStyle(nextProps) {
		_.forIn(nextProps.layers, (layer)=> {
			if (layer.didChange && layer.didChange.filter) {
				this.map.setFilter(layer.id, layer.filter);
				if (layer.metadata && layer.metadata.renderedFeatures) {
					const getRenderedFeatures = ()=> {
						const renderedFeatures = this.map.queryRenderedFeatures({ layers: [layer.id] });
						this.props.dispatch(updateRenderedFeatures(layer.id, renderedFeatures, this.map.getZoom()));
					}
					const renderHandler = (data)=> {
						if (this.map.isStyleLoaded() && this.map.isSourceLoaded(layer.source)) {
							getRenderedFeatures();
							this.map.off('render', renderHandler);
						}
					}
					this.map.on('render', renderHandler);
				}
			}
			if (layer.didChange && layer.didChange.zoom) {
				this.map.setLayerZoomRange(layer.id, layer.minzoom, layer.maxzoom);
			}
			if (layer.didChange && layer.didChange.layout) {
				_.forIn(layer.didChange.layout, (value, key)=> {
					this.map.setLayoutProperty(layer.id, key, value);
				});
			}
			if (layer.didChange && layer.didChange.paint) {
				_.forIn(layer.didChange.paint, (value, key)=> {
					this.map.setPaintProperty(layer.id, key, value);
				});
			}
		});
	}
}

function updateRenderedFeatures(layerId, features, zoom) {
	return  {
		type: 'UPDATE_FEATURES_' + layerId.toUpperCase(),
		payload: { features, zoom }
	};
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
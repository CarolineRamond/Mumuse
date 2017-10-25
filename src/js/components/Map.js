import React from "react";
import _ from "lodash";
import { connect } from "react-redux"
import mapboxgl from "mapbox-gl"
import 'mapbox-gl/dist/mapbox-gl.css'
mapboxgl.accessToken = 'pk.eyJ1IjoiaWNvbmVtIiwiYSI6ImNpbXJycDBqODAwNG12cW0ydGF1NXZxa2sifQ.hgPcQvgkzpfYkHgfMRqcpw';

import '../../css/map.css'

// this is to set up component's props
// component's props will be an excerpt
// of the store
// + some functions like dispatch (to fire actions)
@connect((store)=> {
	var sources = {};
	var layers = {};

	_.forIn(store, (item, key)=> {
		if (item.sources) {
			sources = _.extend(sources, item.sources);
		}
		if (item.layers) {
			layers = _.extend(layers, item.layers);
		}
	});
	return {
		world: store.world,
		layers: layers,
		sources: sources
	}
})

export default class Map extends React.Component {

	componentDidMount() {
		const { lat, lng, zoom } = this.props.world;
		this.map = new mapboxgl.Map({
			container: this.mapContainer,
			style: 'mapbox://styles/iconem/cio487j79006hc7m7wu00w6hw',
			center: [lng, lat],
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
			this.map.addSource(sourceId, _.omit(source, ['metadata']));
		});
	}

	_loadLayers() {
		_.forIn(this.props.layers, (layer, layerId)=> {
			this.map.addLayer(layer);
		});
	}

	_addSimpleEventsHandling() {
		this.props.config.events.map((event)=> {
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
		this.props.config.dragndrop.map((item)=> {
			// disable/enable map panning
			// on enter/leave layer
			this.map.on('mouseenter', item.layerId, (evt)=> {
				this.map.dragPan.disable();
			});
			this.map.on('mouseleave', item.layerId, (evt)=> {
				this.map.dragPan.enable();
			});

			// detect mousedown on layer, setup mouseup event (once)
			// and dispatch corresponding action
			this.map.on('mousedown', item.layerId, (evt)=> {
				this.props.dispatch(item.mousedown(evt));
				this.draggingLayerId = item.layerId;

				this.map.once('mouseup', (evt)=> {
					this.props.dispatch(item.mouseup(evt));
					this.draggingLayerId = null;
				});
			});
		});	

		// add mousemove listener only if one of the layers
		// has dragndrop interaction
		if (this.props.config.dragndrop.length > 0) {
			this.map.on('mousemove', (evt)=> {
				if (this.draggingLayerId) {
					this.props.config.dragndrop.map((item)=> {
						if (item.layerId === this.draggingLayerId) {
							this.props.dispatch(item.mousemove(evt));
						}
					});
				}
			});
		}
	}

	_addViewportChangeHandling() {
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
			if (source.metadata && source.metadata.didChange) {
				this.map.getSource(sourceId).setData(source.data);
			}
		});
	}

	_updateLayersStyle(nextProps) {
		_.forIn(nextProps.layers, (layer)=> {
			var didChange = layer.metadata && layer.metadata.didChange || {};
			if (didChange.filter) {
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
			if (didChange.zoom) {
				this.map.setLayerZoomRange(layer.id, layer.minzoom, layer.maxzoom);
			}
			if (didChange.layout) {
				_.forIn(didChange.layout, (value, key)=> {
					this.map.setLayoutProperty(layer.id, key, value);
				});
			}
			if (didChange.paint) {
				_.forIn(didChange.paint, (value, key)=> {
					this.map.setPaintProperty(layer.id, key, value);
				});
			}
		});
	}
}

function updateRenderedFeatures(layerId, features, zoom) {
	return  {
		type: 'UPDATE_FEATURES_' + layerId.toUpperCase(),
		payload: { features, zoom },
		meta: {
			throttle: 500
		}
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
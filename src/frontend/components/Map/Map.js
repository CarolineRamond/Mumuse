import React from "react";
import _ from "lodash";
import { connect } from "react-redux"
import { withRouter } from "react-router"
import mapboxgl from "mapbox-gl"
import 'mapbox-gl/dist/mapbox-gl.css'
mapboxgl.accessToken = 'pk.eyJ1IjoiaWNvbmVtIiwiYSI6ImNpbXJycDBqODAwNG12cW0ydGF1NXZxa2sifQ.hgPcQvgkzpfYkHgfMRqcpw';
import PropTypes from "prop-types"
import ProgressBar from "react-toolbox/lib/progress_bar"

import { mapConfig, getLayersState, getSourcesState } from '../../modules'
import { isAuthUserAdmin } from "../../modules/auth"
import styles from "./map.css"

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

class Map extends React.Component {

	componentDidMount() {
		if (!this.props.layersState.pending) {
			this._initMap();
		}
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.world.shouldMapResize) {
			this._resizeMap();
		}
		if (!nextProps.layersState.pending && this.props.layersState.pending) {
			// layers did just load : init map
			this._initMap();
		} else if (!nextProps.layersState.pending) {
			this._reloadSourcesData(nextProps);
			this._updateLayersStyle(nextProps);
		}
	}

	shouldComponentUpdate(nextProps) {
		// rerender component only if loader should be hidden
		// ie if layers are just loaded
		// mapbox will rerender the map independently from react
		// otherwise
		return (!nextProps.layersState.pending && this.props.layersState.pending);
	}

	render() {
		return <div>
			<div style={{position:'absolute', width: '100%', height: '100%'}} ref={el => this.mapContainer = el}></div>
			{this.props.layersState.pending &&
				<div className={styles.mapLoader}>
					{/*<ProgressBar type="circular" mode="indeterminate" />*/}
					Loading...
				</div>
			}
		</div>
	}

	componentWillUnmount() {
		this.map.remove();
	}

	_initMap() {
		const world = this.props.location.pathname.split('/')[1].split(',');
		const lngLat = world.slice(0,2);
		const zoom = world[2];
		this.renderHandlers = {};
		this.map = new mapboxgl.Map({
			container: this.mapContainer,
			style: 'mapbox://styles/iconem/cio487j79006hc7m7wu00w6hw',
			center: lngLat,
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
			this._addClickHandling();
			this._addDragndropHandling();
			this._addViewportChangeHandling();
			this._resizeMap();
		});
	}

	_loadSources() {
		_.forIn(this.props.sourcesState.data, (source, sourceId)=>{
			this.map.addSource(sourceId, _.omit(source, ['metadata']));
		});
	}

	_loadLayers() {
		_.forIn(this.props.layersState.data, (layer, layerId)=> {
			this.map.addLayer(layer);
		});
	}

	_addSimpleEventsHandling() {
		mapConfig.events.map((event)=> {
			if (event.layerId) {
				this.map.on(event.type, event.layerId, (evt)=> {
					this.props.dispatch(event.action({
						event: evt,
						isAdmin: this.props.isAdmin
					}));
				});
			} else {
				this.map.on(event.type, (evt)=> {
					this.props.dispatch(event.action({
						event: evt,
						isAdmin: this.props.isAdmin
					}));
				});
			}
		});
	}

	_addClickHandling() {
		if (mapConfig.click.length > 0) {
			this.map.on('click', (evt)=> {
				mapConfig.click.map((item)=> {
					const features = this.map.queryRenderedFeatures(
						evt.point, 
						{ layers: item.layerIds }
					);
					const ctrlKey = evt.originalEvent.ctrlKey;
					this.props.dispatch(item.action({ 
						features, 
						ctrlKey, 
						isAdmin: this.props.isAdmin 
					}));
				});
			});
		}
	}

	_addDragndropHandling() {
		mapConfig.dragndrop.map((item)=> {
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
				this.props.dispatch(item.mousedown({
					event: evt, 
					isAdmin: this.props.isAdmin
				}));
				this.draggingLayerId = item.layerId;

				this.map.once('mouseup', (evt)=> {
					const features = this.map.queryRenderedFeatures(
						evt.point, 
						{ layers: [item.layerId] }
					);
					this.props.dispatch(item.mouseup({
						feature: features[0],
						event: evt, 
						isAdmin: this.props.isAdmin
					}));
					this.draggingLayerId = null;
				});
			});
		});	

		// add mousemove listener only if one of the layers
		// has dragndrop interaction
		if (mapConfig.dragndrop.length > 0) {
			this.map.on('mousemove', (evt)=> {
				if (this.draggingLayerId) {
					mapConfig.dragndrop.map((item)=> {
						if (item.layerId === this.draggingLayerId) {
							this.props.dispatch(item.mousemove({
								event: evt,
								isAdmin: this.props.isAdmin
							}));
						}
					});
				}
			});
		}
	}

	_addViewportChangeHandling() {
		// update window location on moveend
		this.map.on('moveend', (e)=> {
			const splitLocation = this.props.location.pathname.split('/');
			const { lng, lat } = this.map.getCenter();
			const zoom = this.map.getZoom();
			splitLocation[1] = [lng, lat, zoom].join(',');
			const newLocation = splitLocation.join('/');
			this.props.history.replace(newLocation);
		});

		// set up events to update viewport counts
		// (and dispatch actions) when needed
		mapConfig.renderedFeatures.map((item)=> {
			const init = true;
			this._setRenderedFeaturesHandler(item, init);
		});
	}

	_setRenderedFeaturesHandler(item, init) {
		if (!this.renderHandlers[item.layerIds.toString()]) {
			// register handler into this.renderHandlers
			// this will allow render listeners to be deleted
			// before being put back
			// => there is at most one listener per renderedFeatures item
			// at any time
			const getRenderedFeatures = ()=> {
				const renderedFeatures = getUniqueFeatures(
					this.map.queryRenderedFeatures({ layers: item.layerIds }),
					item.uniqueKey
				);
				this.props.dispatch(item.action(renderedFeatures, this.map.getZoom()));
			}
			const renderHandler = (data)=> {
				if (this.map.isStyleLoaded() && this.map.isSourceLoaded(item.source)) {
					getRenderedFeatures();
					this.map.off('render', renderHandler);
				}
			}
			this.renderHandlers[item.layerIds.toString()] = renderHandler;
		}
		

		// wait for a map rendering
		// that displays item's source and layer
		// once this rendering is done,
		// update viewport count and cancels render listener
		this.map.off('render', this.renderHandlers[item.layerIds.toString()]);
		this.map.on('render', this.renderHandlers[item.layerIds.toString()]);

		// only on init : does same thing on map moveend
		if (init) {
			this.map.on('moveend', ()=> {
				this.map.on('render', this.renderHandlers[item.layerIds.toString()]);
			});
		}
	}

	_resizeMap() {
		this.map.resize();
	}

	_reloadSourcesData(nextProps) {
		_.forIn(nextProps.sourcesState.data, (source, sourceId)=> {
			if (source.metadata && source.metadata.didChange && this.map.getSource(sourceId)) {
				if (source.type === "geojson") {
					this.map.getSource(sourceId).setData(source.data);
				}
				if (source.type === "vector") {
					this.map.removeSource(sourceId);
					this.map.addSource(sourceId, _.omit(source, ['metadata']));
					mapConfig.renderedFeatures.map((item)=> {
						if (item.source === sourceId) {
							this._setRenderedFeaturesHandler(item);
						}
					});
				}
			}
		});
	}

	_updateLayersStyle(nextProps) {
		_.forIn(nextProps.layersState.data, (layer)=> {
			var didChange = layer.metadata && layer.metadata.didChange || {};
			if (this.map.getLayer(layer.id) && didChange.filter) {
				this.map.setFilter(layer.id, layer.filter);
				mapConfig.renderedFeatures.map((item)=> {
					if (item.layerIds.indexOf(layer.id) > -1) {
						this._setRenderedFeaturesHandler(item);
					}
				});
			}
			if (this.map.getLayer(layer.id) && didChange.zoom) {
				this.map.setLayerZoomRange(layer.id, layer.minzoom, layer.maxzoom);
			}
			if (this.map.getLayer(layer.id) && didChange.layout) {
				_.forIn(didChange.layout, (value, key)=> {
					this.map.setLayoutProperty(layer.id, key, value);
				});
			}
			if (this.map.getLayer(layer.id) && didChange.paint) {
				_.forIn(didChange.paint, (value, key)=> {
					this.map.setPaintProperty(layer.id, key, value);
				});
			}
		});
	}
}

// Props :
// * world : current world state (lat, lng, zoom + resize), provided by @connect
// * layers : map layers, provided by @connect
// * sources : map sources, provided by @connect
// * location : current route location, provided by function withRouter 
// * match : current route match, provided by function withRouter (required)
// * history : current router history, provided by function withRouter (required)
Map.propTypes = {
	world: PropTypes.shape({
		lat: PropTypes.number.isRequired,
		lng: PropTypes.number.isRequired,
		zoom: PropTypes.number.isRequired,
		shouldMapResize: PropTypes.bool
	}),
	layers: PropTypes.object,
	sources: PropTypes.object,
    location: PropTypes.object.isRequired, 
    match: PropTypes.object, 
    history: PropTypes.object.isRequired
}

// Store connection
const ConnectedMap = connect((store)=> {
	return {
		world: store.world,
		layersState: getLayersState(store),
		sourcesState: getSourcesState(store),
		isAdmin: isAuthUserAdmin(store.auth)
	}
})(Map);

export default withRouter(ConnectedMap);
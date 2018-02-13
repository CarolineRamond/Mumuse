import React from 'react';
import { forIn, omit } from 'lodash';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
mapboxgl.accessToken =
    'pk.eyJ1IjoiaWNvbmVtIiwiYSI6ImNpbXJycDBqODAwNG12cW0ydGF1NXZxa2sifQ.hgPcQvgkzpfYkHgfMRqcpw';
import PropTypes from 'prop-types';

import { selectors } from '../../modules';
const { isAuthUserAdmin, getLayersState, getSourcesState } = selectors;
import { actions } from '../../modules';
const { updateWorldState } = actions;
import { mapConfig } from '../../modules';

import styles from './map.css';

import proj4 from 'proj4';
import Camera from '../Potree/Camera';

function getUniqueFeatures(array, comparatorProperty) {
    const existingFeatureKeys = {};
    // Because features come from tiled vector data, feature geometries may be split
    // or duplicated across tile boundaries and, as a result, features may appear
    // multiple times in query results.
    const uniqueFeatures = array.filter(function(el) {
        if (existingFeatureKeys[el.properties[comparatorProperty]]) {
            return false;
        } else {
            existingFeatureKeys[el.properties[comparatorProperty]] = true;
            return true;
        }
    });
    return uniqueFeatures;
}

export class Map extends React.Component {
    componentDidMount() {
        if (!this.props.layersState.pending) {
            this._initMap();
        }
        this.props.setResizeHandler(this.handleResize.bind(this));
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.world.previewMode !== this.props.world.previewMode) {
            const shouldFitBoundsAfterResize = true;
            this.handleResize(shouldFitBoundsAfterResize);
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
        return !nextProps.layersState.pending && this.props.layersState.pending;
    }

    componentWillUnmount() {
        this.map.remove();
    }

    _initMap() {
        const world = this.props.location.pathname.split('/')[1].split(',');
        const lngLat = world.slice(0, 2);
        const zoom = world[2];
        this.renderHandlers = {};
        this.map = new mapboxgl.Map({
            container: this.mapContainer,
            style: 'mapbox://styles/iconem/cio487j79006hc7m7wu00w6hw',
            center: lngLat,
            zoom: zoom,
            renderWorldCopies: false,
            maxBounds: [[-180, -85], [180, 85]],
            transformRequest: url => {
                if (url.match(/\/userdrive\/tile\/grid\/\d+\/\d+\/\d+.pbf$/)) {
                    const bounds = this.map
                        .getBounds()
                        .toArray()
                        .toString();
                    return {
                        url: url + '/?viewport=' + bounds
                    };
                }
            }
        });
        this.draggingLayerId = null;

        this.map.on('load', () => {
            this._loadSources();
            this._loadLayers();
            this._addSimpleEventsHandling();
            this._addDragndropHandling();
            this._addClickHandling();
            this._addViewportChangeHandling();
            this.handleResize();
        });
    }

    _loadSources() {
        forIn(this.props.sourcesState.data, (source, sourceId) => {
            this.map.addSource(sourceId, omit(source, ['metadata']));
        });
    }

    _loadLayers() {
        // sort layers by priority
        const layers = [];
        forIn(this.props.layersState.data, layer => {
            layers.push(layer);
        });
        layers.sort((a, b) => {
            return a.metadata.priority - b.metadata.priority;
        });
        // add layers to map
        layers.map(layer => {
            this.map.addLayer(layer);
        });
    }

    _addSimpleEventsHandling() {
        mapConfig.events.map(event => {
            const eventHandler = () => {
                const { lng, lat } = this.map.getCenter();
                const zoom = this.map.getZoom();
                const bounds = this.map
                    .getBounds()
                    .toArray()
                    .reduce((tab, item) => {
                        return tab.concat(item);
                    }, []);
                this.props.dispatch(
                    event.action({
                        lng,
                        lat,
                        zoom,
                        bounds,
                        isAdmin: this.props.isAdmin
                    })
                );
            };
            if (event.layerId) {
                this.map.on(event.type, event.layerId, eventHandler);
            } else {
                this.map.on(event.type, eventHandler);
            }
        });
    }

    _addClickHandling() {
        if (mapConfig.click.length > 0) {
            this.map.on('click', evt => {
                mapConfig.click.map(item => {
                    const features = this.map.queryRenderedFeatures(evt.point, {
                        layers: item.layerIds
                    });
                    const ctrlKey = evt.originalEvent.ctrlKey;
                    this.props.dispatch(
                        item.action({
                            features,
                            ctrlKey,
                            isAdmin: this.props.isAdmin
                        })
                    );
                });
            });
        }
    }

    _addDragndropHandling() {
        mapConfig.dragndrop.map(item => {
            // disable/enable map panning
            // on enter/leave layer
            this.map.on('mouseenter', item.layerId, () => {
                this.map.dragPan.disable();
            });
            this.map.on('mouseleave', item.layerId, () => {
                this.map.dragPan.enable();
            });

            // detect mousedown on layer, setup mouseup event (once)
            // and dispatch corresponding action
            this.map.on('mousedown', item.layerId, event => {
                this.props.dispatch(
                    item.mousedown({
                        features: event.features,
                        isAdmin: this.props.isAdmin
                    })
                );
                this.draggingLayerId = item.layerId;

                this.map.once('mouseup', evt => {
                    const features = this.map.queryRenderedFeatures(evt.point, {
                        layers: [item.layerId]
                    });
                    this.props.dispatch(
                        item.mouseup({
                            feature: features[0],
                            lat: evt.lngLat.lat,
                            lng: evt.lngLat.lng,
                            isAdmin: this.props.isAdmin
                        })
                    );
                    this.draggingLayerId = null;
                });
            });
        });

        // add mousemove listener only if one of the layers
        // has dragndrop interaction
        if (mapConfig.dragndrop.length > 0) {
            this.map.on('mousemove', evt => {
                if (this.draggingLayerId) {
                    mapConfig.dragndrop.map(item => {
                        if (item.layerId === this.draggingLayerId) {
                            this.props.dispatch(
                                item.mousemove({
                                    lat: evt.lngLat.lat,
                                    lng: evt.lngLat.lng,
                                    isAdmin: this.props.isAdmin
                                })
                            );
                        }
                    });
                }
            });
        }
    }

    _addViewportChangeHandling() {
        // update world state on moveend
        this.map.on('moveend', () => {
            const { lng, lat } = this.map.getCenter();
            const zoom = this.map.getZoom();
            const bounds = this.map.getBounds();
            updateWorldState({ lng, lat, zoom, bounds });
        });

        // set up events to update viewport counts
        // (and dispatch actions) when needed
        mapConfig.renderedFeatures.map(item => {
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
            const getRenderedFeatures = () => {
                let renderedFeatures;
                if (item.shouldQueryOnSource) {
                    renderedFeatures = getUniqueFeatures(
                        this.map.querySourceFeatures(item.source),
                        item.uniqueKey
                    );
                } else {
                    renderedFeatures = getUniqueFeatures(
                        this.map.queryRenderedFeatures({ layers: item.layerIds }),
                        item.uniqueKey
                    );
                }
                this.props.dispatch(
                    item.action({
                        features: renderedFeatures,
                        zoom: this.map.getZoom()
                    })
                );
            };
            const renderHandler = () => {
                if (this.map.isSourceLoaded(item.source)) {
                    getRenderedFeatures();
                    this.map.off('render', renderHandler);
                }
            };
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
            this.map.on('moveend', () => {
                this.map.on('render', this.renderHandlers[item.layerIds.toString()]);
            });
        }
    }

    handleResize(shouldFitBoundsAfterResize) {
        const bounds = this.map.getBounds();
        this.map.resize();
        if (shouldFitBoundsAfterResize) {
            this.map.fitBounds(bounds);
        }
    }

    _reloadSourcesData(nextProps) {
        forIn(nextProps.sourcesState.data, (source, sourceId) => {
            if (source.metadata && source.metadata.didChange && this.map.getSource(sourceId)) {
                if (source.type === 'geojson') {
                    if (source.data.features.length > 0) {
                        source.data.features.map(feature => {
                            if (feature.properties.camera3d) {
                                if (typeof feature.properties.camera3d === 'string') {
                                    feature.properties.camera3d = JSON.parse(
                                        feature.properties.camera3d
                                    );
                                }
                                const camera = new Camera(feature.properties);
                                const firstProjection =
                                    '+proj=utm +zone=38 +ellps=WGS84 +datum=WGS84 +units=m +no_defs';
                                const secondProjection =
                                    '+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs';
                                feature.geometry.type = 'GeometryCollection';
                                feature.geometry.geometries = [];
                                camera.geometry.faces.map((face, i) => {
                                    if (i < 4) {
                                        const facesEnum = ['a', 'b', 'c'];
                                        const triangle = [];
                                        facesEnum.map(faceNumber => {
                                            let vertex = camera.geometry.vertices[
                                                face[faceNumber]
                                            ].clone();
                                            vertex = proj4(
                                                firstProjection,
                                                secondProjection,
                                                vertex.applyMatrix4(camera.world_cam_matrix_inv)
                                            );
                                            triangle.push([vertex.x, vertex.y]);
                                        });
                                        triangle.push(triangle[0]);
                                        feature.geometry.geometries[i] = {
                                            type: 'Polygon',
                                            coordinates: [triangle]
                                        };
                                    }
                                });
                            }
                        });
                    }

                    this.map.getSource(sourceId).setData(source.data);
                }
                if (source.type === 'vector') {
                    this.map.removeSource(sourceId);
                    this.map.addSource(sourceId, omit(source, ['metadata']));
                    mapConfig.renderedFeatures.map(item => {
                        if (item.source === sourceId) {
                            this._setRenderedFeaturesHandler(item);
                        }
                    });
                }
            }
        });
    }

    _updateLayersStyle(nextProps) {
        forIn(nextProps.layersState.data, layer => {
            const didChange = (layer.metadata && layer.metadata.didChange) || {};
            if (this.map.getLayer(layer.id) && didChange.filter) {
                this.map.setFilter(layer.id, layer.filter);
                mapConfig.renderedFeatures.map(item => {
                    if (item.layerIds.indexOf(layer.id) > -1) {
                        this._setRenderedFeaturesHandler(item);
                    }
                });
            }
            if (this.map.getLayer(layer.id) && didChange.zoom) {
                this.map.setLayerZoomRange(layer.id, layer.minzoom, layer.maxzoom);
            }
            if (this.map.getLayer(layer.id) && didChange.layout) {
                forIn(didChange.layout, (value, key) => {
                    this.map.setLayoutProperty(layer.id, key, value);
                });
            }
            if (this.map.getLayer(layer.id) && didChange.paint) {
                forIn(didChange.paint, (value, key) => {
                    this.map.setPaintProperty(layer.id, key, value);
                });
            }
        });
    }

    render() {
        return (
            <div>
                <div
                    style={{ position: 'absolute', width: '100%', height: '100%' }}
                    ref={el => {
                        this.mapContainer = el;
                    }}
                />
                {this.props.layersState.pending && (
                    <div className={styles.mapLoader}>Loading...</div>
                )}
            </div>
        );
    }
}

Map.propTypes = {
    /** redux store dispatch function, provided by connect */
    dispatch: PropTypes.func.isRequired,

    /** whether currently authenticated user has admin rights */
    isAdmin: PropTypes.bool,

    /** map layers, provided by connect */
    layersState: PropTypes.shape({
        /** whether layers are being retrieved from server */
        pending: PropTypes.bool.isRequired,
        /** contains an array of error strings if some layers could not be retrieved from server */
        error: PropTypes.object,
        /** contains a map { layerId -> layer } once layers are retrieved from server */
        data: PropTypes.object
    }).isRequired,

    /** current route location, provided by function withRouter */
    location: PropTypes.object.isRequired,

    /** current route match, provided by function withRouter */
    match: PropTypes.object,

    /** function called on mount to transmit handleResize function to component's parent (Main), inherited from Main */
    setResizeHandler: PropTypes.func.isRequired,

    /** map sources, provided by connect */
    sourcesState: PropTypes.shape({
        /** whether sources are being retrieved from server */
        pending: PropTypes.bool.isRequired,
        /** contains an array of error strings if some sources could not be retrieved from server */
        error: PropTypes.object,
        /** contains a map { sourceId -> source } once sources are retrieved from server */
        data: PropTypes.object
    }).isRequired,

    /** current world state, provided by connect */
    world: PropTypes.shape({
        /** map center's latitude */
        lat: PropTypes.number.isRequired,
        /** map center's longitude */
        lng: PropTypes.number.isRequired,
        /** whether map is in preview mode */
        previewMode: PropTypes.bool,
        /** map zoom */
        zoom: PropTypes.number.isRequired
    }).isRequired
};

// Store connection
const ConnectedMap = connect(store => {
    return {
        world: store.world,
        layersState: getLayersState(store),
        sourcesState: getSourcesState(store),
        isAdmin: isAuthUserAdmin(store)
    };
})(Map);

export default withRouter(ConnectedMap);

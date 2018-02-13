import React from 'react';
import { connect } from 'react-redux';
import { forIn } from 'lodash';
import { IconButton } from 'react-toolbox/lib/button';
import PropTypes from 'prop-types';

import { actions } from '../../modules';
const { toggleLayer, togglePointCloud } = actions;
import { selectors } from '../../modules';
const { getRasterLayersInBounds, getVisiblePointClouds } = selectors;

import styles from './layers.css';

class Layers extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            index: 0
        };
        this.toggleLayer = this.toggleLayer.bind(this);
    }

    toggleLayer(layerId) {
        this.props.dispatch(toggleLayer({ layerId }));
    }

    togglePointCloud(pointCloudId) {
        this.props.dispatch(togglePointCloud({ pointCloudId }));
    }

    render() {
        const mappedMediaLayers = [];
        const mappedRasterLayers = [];
        const mappedPointCloudLayers = [];
        const mappedPointClouds = [];

        forIn(this.props.mediaLayers, (layer, layerId) => {
            let icon = 'visibility_off';
            if (layer.metadata.isLocked) {
                icon = 'lock';
            } else if (layer.metadata.isShown) {
                icon = 'visibility';
            }
            mappedMediaLayers.push(
                <div key={layerId} className={styles.layer}>
                    <IconButton
                        disabled={layer.metadata.isLocked}
                        onClick={() => {
                            this.toggleLayer(layerId);
                        }}
                        icon={icon}
                    />
                    {layer.metadata.name}
                </div>
            );
        });

        forIn(this.props.rasterLayers, (layer, layerId) => {
            let icon = 'visibility_off';
            if (layer.metadata.isLocked) {
                icon = 'lock';
            } else if (layer.metadata.isShown) {
                icon = 'visibility';
            }
            mappedRasterLayers.push(
                <div key={layerId} className={styles.layer}>
                    <IconButton
                        disabled={layer.metadata.isLocked}
                        onClick={() => {
                            this.toggleLayer(layerId);
                        }}
                        icon={icon}
                    />
                    {layer.metadata.name}
                </div>
            );
        });

        forIn(this.props.pointCloudLayers, (layer, layerId) => {
            let icon = 'visibility_off';
            if (layer.metadata.isLocked) {
                icon = 'lock';
            } else if (layer.metadata.isShown) {
                icon = 'visibility';
            }
            mappedPointCloudLayers.push(
                <div key={layerId} className={styles.layer}>
                    <IconButton
                        disabled={layer.metadata.isLocked}
                        onClick={() => {
                            this.toggleLayer(layerId);
                        }}
                        icon={icon}
                    />
                    {layer.metadata.name}
                </div>
            );
        });

        // forIn(this.props.visiblePointClouds, feature => {
        //     const icon = feature.metadata.isShown ? 'visibility' : 'visibility_off';
        //     mappedPointClouds.push(
        //         <div key={feature.properties._id} className={styles.layer}>
        //             <IconButton
        //                 onClick={() => {
        //                     this.togglePointCloud(feature.properties._id);
        //                 }}
        //                 icon={icon}
        //             />
        //             {feature.properties.name}
        //         </div>
        //     );
        // });

        return (
            <div style={{ overflowY: 'scroll' }}>
                <h3>Medias</h3>
                <div>{mappedMediaLayers}</div>
                {mappedPointCloudLayers.length > 0 && (
                    <div>
                        <hr />
                        <h3>Point clouds</h3>
                        <div>{mappedPointCloudLayers}</div>
                    </div>
                )}
                {/*<div>
                                    <hr />
                                    <h3>Point clouds</h3>
                                    <div>{mappedPointClouds}</div>
                                </div>*/}
                {mappedRasterLayers.length > 0 && (
                    <div>
                        <hr />
                        <h3>Orthophotos</h3>
                        <div>{mappedRasterLayers}</div>
                    </div>
                )}
            </div>
        );
    }
}

Layers.propTypes = {
    /** redux store dispatch function, provided by connect */
    dispatch: PropTypes.func.isRequired,

    /** map {layerId -> layer} containing medias-related layers, provided by connect */
    mediaLayers: PropTypes.object.isRequired,

    /** map {layerId -> layer} containing pointCloud-related layers, provided by connect */
    pointCloudLayers: PropTypes.object.isRequired,

    /** map {layerId -> layer} containing rasterlayers, provided by connect */
    rasterLayers: PropTypes.object.isRequired

    /** array of currently visible pointCloud features, provided by connect */
    // visiblePointClouds: PropTypes.arrayOf(PropTypes.object).isRequired
};

// Store connection
const ConnectedLayers = connect(store => {
    return {
        mediaLayers: store.medias.layers,
        rasterLayers: getRasterLayersInBounds(store),
        pointCloudLayers: store.potree.layers
        // visiblePointClouds: getVisiblePointClouds(store)
    };
})(Layers);

export default ConnectedLayers;

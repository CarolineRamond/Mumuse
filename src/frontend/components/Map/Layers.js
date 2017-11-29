import React from 'react';
import { connect } from 'react-redux';
import { forIn } from 'lodash';
import { IconButton } from 'react-toolbox/lib/button';
import PropTypes from 'prop-types';

import { actions } from '../../modules';
const { toggleLayer } = actions;
import { selectors } from '../../modules';
const { getRasterLayersInBounds } = selectors;

import styles from './layers.css';

class Layers extends React.Component {
	constructor (props) {
    super(props);
    this.state = {
      index: 0
    };
    this.toggleLayer = this.toggleLayer.bind(this);
  }

  toggleLayer (layerId) {
    this.props.dispatch(toggleLayer({ layerId }));
  }

	render () {
    const mappedMediaLayers = [];
    const mappedRasterLayers = [];
    const mappedPointCloudLayers = [];

    forIn(this.props.mediaLayers, (layer, layerId)=> {
      let icon = 'visibility_off';
      if (layer.metadata.isLocked) {
        icon = 'lock';
      } else if (layer.metadata.isShown) {
        icon = 'visibility';
      }
      mappedMediaLayers.push(<div key={layerId} className={styles.layer}>
        <IconButton disabled={layer.metadata.isLocked}
          onClick={()=> {this.toggleLayer(layerId);}} icon={icon}/>
        {layer.metadata.name}
      </div>);
    });

    forIn(this.props.rasterLayers, (layer, layerId)=> {
      let icon = 'visibility_off';
      if (layer.metadata.isLocked) {
        icon = 'lock';
      } else if (layer.metadata.isShown) {
        icon = 'visibility';
      }
      mappedRasterLayers.push(<div key={layerId} className={styles.layer}>
        <IconButton disabled={layer.metadata.isLocked}
          onClick={()=> {this.toggleLayer(layerId);}} icon={icon}/>
        {layer.metadata.name}
      </div>);
    });

    forIn(this.props.pointCloudLayers, (layer, layerId)=> {
      let icon = 'visibility_off';
      if (layer.metadata.isLocked) {
        icon = 'lock';
      } else if (layer.metadata.isShown) {
        icon = 'visibility';
      }
      mappedPointCloudLayers.push(<div key={layerId} className={styles.layer}>
        <IconButton disabled={layer.metadata.isLocked}
          onClick={()=> {this.toggleLayer(layerId);}} icon={icon}/>
        {layer.metadata.name}
      </div>);
    });

		return <div>
      <h3>Medias</h3>
      <div>{mappedMediaLayers}</div>
      {mappedPointCloudLayers.length > 0
        && <div>
          <hr/>
          <h3>Point clouds</h3>
          <div>{mappedPointCloudLayers}</div>
        </div>
      }
      {mappedRasterLayers.length > 0
        && <div>
          <hr/>
          <h3>Orthophotos</h3>
          <div>{mappedRasterLayers}</div>
        </div>
      }
    </div>;
	}
}

// Props :
// * dispatch: redux store dispatch function, provided by connect (required)
// * mediaLayers: map {layerId -> layer} containing medias-related layers,
//   provided by connect (required),
// * pointCloudLayers: map {layerId -> layer} containing pointCloud-related layers,
//   provided by connect (required),
// * rasterLayers: map {layerId -> layer} containing rasterlayers,
//   provided by connect (required),
Layers.propTypes = {
  dispatch: PropTypes.func.isRequired,
  mediaLayers: PropTypes.object.isRequired,
  pointCloudLayers: PropTypes.object.isRequired,
  rasterLayers: PropTypes.object.isRequired
};

// Store connection
const ConnectedLayers = connect((store)=> {
  return {
    mediaLayers: store.medias.layers,
    rasterLayers: getRasterLayersInBounds(store),
    pointCloudLayers: store.potree.layers
  };
})(Layers);

export default ConnectedLayers;

import React from "react";
import { connect } from "react-redux"
import { forIn } from "lodash"
import { IconButton } from "react-toolbox/lib/button"
import PropTypes from "prop-types"

import { actions } from "../../modules"
const { toggleLayer } = actions;
import { selectors } from "../../modules"
const { getRasterLayersInBounds } = selectors;

import styles from './layers.css'

class Layers extends React.Component {
	constructor(props) {
    super(props);
    this.state = {
      index: 0,
    };
    this.toggleLayer = this.toggleLayer.bind(this);
  }

  toggleLayer(layerId) {
    this.props.dispatch(toggleLayer(layerId));
  }

	render() {
    const mappedMediaLayers = [];
    const mappedRasterLayers = [];

    forIn(this.props.mediaLayers, (layer, layerId)=> {
      var icon = "visibility_off";
      if (layer.metadata.isLocked) {
        icon = "lock";
      } else if (layer.metadata.isShown) {
        icon = "visibility";
      }
      mappedMediaLayers.push(<div key={layerId} className={styles.layer}>
        <IconButton disabled={layer.metadata.isLocked}
          onClick={()=> {this.toggleLayer(layerId)}} icon={icon}/>
        {layer.metadata.name}
      </div>);
    });

    forIn(this.props.rasterLayers, (layer, layerId)=> {
      var icon = "visibility_off";
      if (layer.metadata.isLocked) {
        icon = "lock";
      } else if (layer.metadata.isShown) {
        icon = "visibility";
      }
      mappedRasterLayers.push(<div key={layerId} className={styles.layer}>
        <IconButton disabled={layer.metadata.isLocked}
          onClick={()=> {this.toggleLayer(layerId)}} icon={icon}/>
        {layer.metadata.name}
      </div>);
    });

		return <div>
      <h3>Medias</h3>
      <div>{mappedMediaLayers}</div>
      {mappedRasterLayers.length > 0 && 
        <div>
          <hr/>
          <h3>Orthophotos</h3>
          <div>{mappedRasterLayers}</div>
        </div>
      }
    </div>
	}
}

// Props :
// * layers: map layers, provided by @connect (required),
Layers.propTypes = {
  // layers: PropTypes.objectOf(PropTypes.object).isRequired,
}

// Store connection
const ConnectedLayers = connect((store)=> {
  return  {
    mediaLayers: store.medias.layers,
    rasterLayers: getRasterLayersInBounds(store)
  }
})(Layers);

export default ConnectedLayers;
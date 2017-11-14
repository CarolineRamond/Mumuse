import React from "react";
import { connect } from "react-redux"
import { forIn } from "lodash"
import { IconButton } from "react-toolbox/lib/button"
import PropTypes from "prop-types"

import { toggleLayerMedias } from '../../modules/medias/medias.actions'
import { getRasterLayersInBounds } from "../../modules/rastertiles"
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
    this.props.dispatch(toggleLayerMedias(layerId));
  }

	render() {
    const mappedLayers = [];
    _.forIn(this.props.layers, (layer, layerId)=> {
      var icon = "visibility_off";
      if (layer.metadata.isLocked) {
        icon = "lock";
      } else if (layer.metadata.isShown) {
        icon = "visibility";
      }
      mappedLayers.push(<div key={layerId} className={styles.layer}>
        <IconButton disabled={layer.metadata.isLocked}
          onClick={()=> {this.toggleLayer(layerId)}} icon={icon}/>
        {layer.metadata.name}
      </div>);
    });

		return <div>{mappedLayers}</div>
	}
}

// Props :
// * layers: map layers, provided by @connect (required),
Layers.propTypes = {
  layers: PropTypes.objectOf(PropTypes.object).isRequired,
}

// Store connection
const ConnectedLayers = connect((store)=> {
  const rasterLayers = getRasterLayersInBounds(store.rastertiles);
  const mediaLayers = store.medias.layers;
  const layers = Object.assign({}, rasterLayers, mediaLayers);
  return  {
    layers: layers
  }
})(Layers);

export default ConnectedLayers;
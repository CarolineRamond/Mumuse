import React from "react";
import { connect } from "react-redux"
import { forIn } from "lodash"
import { IconButton } from "react-toolbox/lib/button"

import { toggleLayerMedias } from '../../modules/medias/medias.actions'
import styles from './layers.css'

// this is to set up component's props
// component's props will be an excerpt
// of the store
// + some functions like dispatch (to fire actions)
@connect((store)=> {
  return  {
    layers: store.medias.layers
  }
})

export default class Layers extends React.Component {
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
import React from "react";
import { connect } from "react-redux"
import _ from "lodash"
import IconButton from "material-ui/IconButton"

import '../../css/pannel.css'
import { toggleLayerMedias } from '../modules/medias/medias.actions'
import { getVisibleMedias, getSelectedMedias, getViewportMediaCount, getFilters } from '../modules/medias'

// this is to set up component's props
// component's props will be an excerpt
// of the store
// + some functions like dispatch (to fire actions)
@connect((store)=> {
	return  {
		world: store.world,
		medias: getVisibleMedias(store.medias),
		selectedMedias: getSelectedMedias(store.medias),
		viewportMediaCount: getViewportMediaCount(store.medias),
		layers: store.medias.layers
	}
})

export default class Pannel extends React.Component {


	toggleLayer(layerId) {
		this.props.dispatch(toggleLayerMedias(layerId));
	}

	render() {
		const mappedSelectedMedias = this.props.selectedMedias.map((media)=> {
			return <li key={media.properties._id}>
				{media.properties.name} {media.properties._id}
			</li>
		});

		const mappedLayers = [];
		_.forIn(this.props.layers, (layer, layerId)=> {
			var icon = "visibility_off";
			if (layer.metadata.isLocked) {
				icon = "lock";
			} else if (layer.metadata.isShown) {
				icon = "visibility";
			}
			mappedLayers.push(<div key={layerId} className="layer">
				<IconButton className="layer-toggle" disabled={layer.metadata.isLocked}
					onClick={()=> {this.toggleLayer(layerId)}}>
					<i className="material-icons">{icon}</i>
				</IconButton>
				{layer.metadata.name}
			</div>);
		});

		return <div className="pannel">
			<strong>World</strong>
			<ul>
				<li>Latitude: {this.props.world.lat}</li>
				<li>Longitude: {this.props.world.lng}</li>
				<li>Zoom: {this.props.world.zoom}</li>
			</ul>
			<hr/>
			<strong>Viewport Count</strong>
			<ul>
				<li>Medias : {this.props.viewportMediaCount}</li>
			</ul>
			<strong>Visible medias</strong>
			<ul>
				{this.props.medias.length}
			</ul>
			<strong>Selected medias</strong>
			<ul>
				{mappedSelectedMedias}
			</ul>
			<strong>Layers</strong>
			<div>
				{mappedLayers}
			</div>
		</div>
	}
}
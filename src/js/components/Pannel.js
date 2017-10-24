import React from "react";
import { connect } from "react-redux"

import '../../css/pannel.css'
import { getVisibleMedias, getSelectedMedias, getViewportMediaCount, getFilters } from '../modules/medias/medias.reducer'

// this is to set up component's props
// component's props will be an excerpt
// of the store
// + some functions like dispatch (to fire actions)
@connect((store)=> {
	return  {
		world: store.world,
		medias: getVisibleMedias(store.mapResources.medias),
		selectedMedias: getSelectedMedias(store.mapResources.medias),
		viewportMediaCount: getViewportMediaCount(store.mapResources.medias),
	}
})

export default class Pannel extends React.Component {

	selectMedia(media) {
		this.props.dispatch({ type: "SELECT_MEDIA", payload: { features: [media] } });
	}

	render() {
		const mappedSelectedMedias = this.props.selectedMedias.map((media)=> {
			return <li key={media.properties._id}>
				{media.properties.name} {media.properties._id}
			</li>
		});

		return <div className="pannel">
			<h3>World</h3>
			<ul>
				<li>Latitude: {this.props.world.lat}</li>
				<li>Longitude: {this.props.world.long}</li>
				<li>Zoom: {this.props.world.zoom}</li>
			</ul>
			<hr/>
			<h3>Viewport Count</h3>
			<ul>
				<li>Medias : {this.props.viewportMediaCount}</li>
			</ul>
			<h3>Visible medias</h3>
			<ul>
				{this.props.medias.length}
			</ul>
			<h3>Selected medias</h3>
			<ul>
				{mappedSelectedMedias}
			</ul>
		</div>
	}
}
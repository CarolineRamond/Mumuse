import React from "react";
import { connect } from "react-redux"

import '../../css/pannel.css'

// this is to set up component's props
// component's props will be an excerpt
// of the store
// + some functions like dispatch (to fire actions)
@connect((store)=> {
	return  {
		world: store.world,
		medias: [],
		viewportcount: store.mapResources.medias.viewportcount
	}
})

export default class Pannel extends React.Component {

	selectMedia(media) {
		this.props.dispatch({ type: "SELECT_MEDIA", payload: { features: [media] } });
	}

	selectSite(site) {
		this.props.dispatch({ type: "SELECT_SITE", payload: { features: [site] } });
	}

	render() {
		const mappedMedias = this.props.medias.map((media)=> {
			var className = media.selected ? 'selected':''
			return <li key={media.properties._id} className={className} 
				onClick={()=>this.selectMedia(media)}>
				{media.properties.title}
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
			<h3>Medias</h3>
			<ul>{mappedMedias}</ul>
			<hr/>
			<h3>Viewport Count</h3>
			<ul>
				<li>Medias : {this.props.viewportcount.medias.value}</li>
				<li>Grid : {this.props.viewportcount.grid.value}</li>
			</ul>
		</div>
	}
}
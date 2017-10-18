import React from "react";
import { connect } from "react-redux"

import '../../css/pannel.css'

// this is to set up component's props
// component's props will be an excerpt
// of the store
// + some functions like dispatch (to fire actions)
@connect((store)=> {
	const medias = store.medias.source.data.features.map((feature)=> {
		return feature.properties;
	});
	return  {
		world: store.world,
		medias: medias
	}
})

export default class Pannel extends React.Component {

	selectMedia(mediaId) {
		this.props.dispatch({ type: "SELECT_MEDIA_BY_ID", payload: { mediaId } });
	}

	render() {
		const mappedMedias = this.props.medias.map((media)=> {
			var className = media.selected ? 'selected':''
			return <li key={media._id} className={className} 
				onClick={()=>this.selectMedia(media._id)}>
				{media.title}
			</li>
		});
		return <div className="pannel">
			<div>Latitude: {this.props.world.lat}</div>
			<div>Longitude: {this.props.world.long}</div>
			<div>Zoom: {this.props.world.zoom}</div>
			<hr/>
			<h3>Items</h3>
			<ul>{mappedMedias}</ul>
		</div>
	}
}
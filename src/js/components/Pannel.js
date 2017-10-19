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
	const sites = store.sites.source.data.features.map((feature)=> {
		return feature.properties;
	});
	return  {
		world: store.world,
		medias: medias,
		sites: sites
	}
})

export default class Pannel extends React.Component {

	selectMedia(mediaId) {
		this.props.dispatch({ type: "SELECT_MEDIA_BY_ID", payload: { mediaId } });
	}

	selectSite(siteId) {
		this.props.dispatch({ type: "SELECT_SITE_BY_ID", payload: { siteId } });
	}

	render() {
		const mappedMedias = this.props.medias.map((media)=> {
			var className = media.selected ? 'selected':''
			return <li key={media._id} className={className} 
				onClick={()=>this.selectMedia(media._id)}>
				{media.title}
			</li>
		});
		const mappedSites = this.props.sites.map((site)=> {
			var className = site.selected ? 'selected':''
			return <li key={site._id} className={className} 
				onClick={()=>this.selectSite(site._id)}>
				{site.title}
			</li>
		});
		return <div className="pannel">
			<div>Latitude: {this.props.world.lat}</div>
			<div>Longitude: {this.props.world.long}</div>
			<div>Zoom: {this.props.world.zoom}</div>
			<hr/>
			<h3>Medias</h3>
			<ul>{mappedMedias}</ul>
			<hr/>
			<h3>Sites</h3>
			<ul>{mappedSites}</ul>
		</div>
	}
}
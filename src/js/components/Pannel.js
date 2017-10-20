import React from "react";
import { connect } from "react-redux"

import '../../css/pannel.css'

// this is to set up component's props
// component's props will be an excerpt
// of the store
// + some functions like dispatch (to fire actions)
@connect((store)=> {
	// const medias = store.mapResources.medias.sources["medias-source"].data.features;
	const medias = [];
	const sites = store.mapResources.sites.sources["sites-source"].data.features;
	const viewportcount = {
		medias: store.mapResources.medias.viewportcount.value,
		sites: store.mapResources.sites.viewportcount.value
	};
	return  {
		world: store.world,
		medias: medias,
		sites: sites,
		viewportcount: viewportcount
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
		const mappedSites = this.props.sites.map((site)=> {
			var className = site.selected ? 'selected':''
			return <li key={site.properties._id} className={className} 
				onClick={()=>this.selectSite(site)}>
				{site.properties.title}
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
			<h3>Sites</h3>
			<ul>{mappedSites}</ul>
			<hr/>
			<h3>Viewport Count</h3>
			<ul>
				<li>medias : {this.props.viewportcount.medias}</li>
				<li>sites : {this.props.viewportcount.sites}</li>
			</ul>
		</div>
	}
}
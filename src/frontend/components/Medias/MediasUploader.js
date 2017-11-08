import React from "react";
import { connect } from "react-redux";
import { BrowseButton } from "react-toolbox/lib/button"

import { uploadMedias } from "../../modules/medias/medias.actions"
import styles from './carousel.css'

class MediasUploader extends React.Component {

	constructor(props) {
		super(props);
		this.handleFileUpload = this.handleFileUpload.bind(this);
	}

	handleFileUpload(event) {
	  	this.props.dispatch(uploadMedias(event.target.files, this.props.position));
	}

	shouldComponentUpdate() {
		// React does not need to re-render component
		// when map position changes
		return false;
	}

	render() {
		return <input type="file" 
			onChange={this.handleFileUpload}
			multiple/>
	}
}

const ConnectedMediasUploader = connect((store)=> {
	return {
		position: {
			lng: store.world.lng,
			lat: store.world.lat
		}
	}
})(MediasUploader);

export default ConnectedMediasUploader;
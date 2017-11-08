import React from "react";
import { connect } from "react-redux";
import { BrowseButton } from "react-toolbox/lib/button"

import { uploadMedia } from "../../modules/medias/medias.actions"
import styles from './carousel.css'

class MediasUploader extends React.Component {

	constructor(props) {
		super(props);
		this.handleFileUpload = this.handleFileUpload.bind(this);
	}

	handleFileUpload(event) {
	  	const file = event.target.files[0];
	  	this.props.dispatch(uploadMedia(file, this.props.position));
	}

	shouldComponentUpdate() {
		// React does not need to re-render component
		// when map position changes
		return false;
	}

	render() {
		return <div className={styles.mediasUploaderContainer}>
			<BrowseButton primary 
				onChange={this.handleFileUpload}>
				Upload medias
			</BrowseButton>
		</div>
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
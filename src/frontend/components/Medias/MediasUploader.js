import React from "react";
import { connect } from "react-redux";
import { Button } from "react-toolbox/lib/button"

import { uploadMedias } from "../../modules/medias/medias.actions"
import styles from './carousel.css'

class MediasUploader extends React.Component {

	constructor(props) {
		super(props);
		this.handleFileUpload = this.handleFileUpload.bind(this);
		this.handleClick = this.handleClick.bind(this);
	}

	handleFileUpload(event) {
	  	this.props.dispatch(uploadMedias(event.target.files, this.props.position));
	}

	handleClick(event) {
	  	this.input.click();
	}

	shouldComponentUpdate() {
		// React does not need to re-render component
		// when map position changes
		return false;
	}

	render() {
		return <div className={styles.mediasUploader}>
			<input type="file"
				onChange={this.handleFileUpload}
				multiple
				ref={(input)=>{this.input = input}}/>
			<Button primary
				onClick={this.handleClick}>
				Upload medias
			</Button>
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
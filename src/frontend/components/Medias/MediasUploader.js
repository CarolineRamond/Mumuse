import React from "react";
import { connect } from "react-redux";
import { Button } from "react-toolbox/lib/button"
import { Dialog } from "react-toolbox/lib/dialog"
import { ProgressBar } from 'react-toolbox/lib/progress_bar';

import { uploadMedias, resetUploadMediasState } from "../../modules/medias/medias.actions"
import { getUploadMediasState } from "../../modules/medias"
import styles from './carousel.css'

class MediasUploader extends React.Component {

	constructor(props) {
		super(props);
		this.handleFileUpload = this.handleFileUpload.bind(this);
		this.handleClick = this.handleClick.bind(this);
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.uploadMediasState.data && !this.props.uploadMediasState.data) {
			// medias have just been uploaded : reset input value
			this.input.value = "";
			this.props.dispatch(resetUploadMediasState());
		} 
	}

	handleFileUpload(event) {
	  	this.props.dispatch(uploadMedias(event.target.files, this.props.position));
	}

	handleClick(event) {
	  	this.input.click();
	}

	shouldComponentUpdate(nextProps) {
		// React does not need to re-render component
		// when map position changes
		// it should re-render only when uploadMediasState.pending changes
		return (nextProps.uploadMediasState.pending !== this.props.uploadMediasState.pending);
	}

	render() {
		const pending = this.props.uploadMediasState.pending;
		const uploadFulfilled = this.props.uploadMediasState.data;
		return <div>
			<div className={styles.mediasUploader}>
				<input type="file"
					onChange={this.handleFileUpload}
					multiple
					ref={(input)=>{this.input = input}}/>
				<Button primary
					onClick={this.handleClick}>
					Upload medias
				</Button>
			</div>
			<Dialog active={pending !== false && !uploadFulfilled}
				title="Uploading medias">
				<div className={styles.mediasUploaderProgress}>
					<ProgressBar type="linear" mode="determinate" 
						value={parseInt(pending.index / pending.length * 100)}/>
					<div>{`${pending.index}/${pending.length}`}</div>
				</div>
			</Dialog>
		</div>
	}
}

const ConnectedMediasUploader = connect((store)=> {
	return {
		position: {
			lng: store.world.lng,
			lat: store.world.lat
		},
		uploadMediasState: getUploadMediasState(store.medias)
	}
})(MediasUploader);

export default ConnectedMediasUploader;
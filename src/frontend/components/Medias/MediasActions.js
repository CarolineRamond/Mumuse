import React from "react";
import { connect } from "react-redux";
import { Button } from "react-toolbox/lib/button"

import MediasUploader from "./MediasUploader"
import { getSelectedMedias } from "../../modules/medias"
import { deleteMedias } from "../../modules/medias/medias.actions"
import styles from './carousel.css'

class MediasActions extends React.Component {

	constructor(props) {
		super(props);
		this.handleDeleteMedias = this.handleDeleteMedias.bind(this);
	}

	handleDeleteMedias() {
		this.props.dispatch(deleteMedias(this.props.selectedMedias));
	}

	render() {
		return <div className={styles.mediasActions}>
			<MediasUploader/>
			<Button accent 
				disabled={this.props.selectedMedias.length === 0}
				onClick={this.handleDeleteMedias}>
				Delete Medias
			</Button>
		</div>
	}
}

const ConnectedMediasActions = connect((store)=> {
	return {
		selectedMedias: getSelectedMedias(store.medias)
	}
})(MediasActions);

export default ConnectedMediasActions;
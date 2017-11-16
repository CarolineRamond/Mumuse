import React from "react";
import { connect } from "react-redux";
import { Button } from "react-toolbox/lib/button"
import { Dialog } from "react-toolbox/lib/dialog"
import { ProgressBar } from 'react-toolbox/lib/progress_bar';

import { deleteMedias } from "../../modules/medias/medias.actions"
import { getSelectedMedias, getDeleteMediasState } from "../../modules/medias"
import styles from './carousel.css'

class MediasDeleter extends React.Component {

	constructor(props) {
		super(props);
		this.handleDeleteMedias = this.handleDeleteMedias.bind(this);
	}

	handleDeleteMedias() {
		this.props.dispatch(deleteMedias(this.props.selectedMedias));
	}

	render() {
		const pending = this.props.deleteMediasState.pending;
		const deleteFulfilled = this.props.deleteMediasState.data;
		return <div>
			<Button accent 
				disabled={this.props.selectedMedias.length === 0}
				onClick={this.handleDeleteMedias}>
				Delete Medias
			</Button>
			<Dialog active={pending !== false && !deleteFulfilled}
				title="Deleting medias">
				<div className={styles.mediasUploaderProgress}>
					<ProgressBar type="linear" mode="determinate" 
						value={parseInt(pending.index / pending.length * 100)}/>
					{pending !== false && 
						<div>{`${pending.index}/${pending.length}`}</div>
					}
				</div>
			</Dialog>
		</div>
	}
}

const ConnectedMediasDeleter = connect((store)=> {
	return {
		selectedMedias: getSelectedMedias(store.medias),
		deleteMediasState: getDeleteMediasState(store.medias)
	}
})(MediasDeleter);

export default ConnectedMediasDeleter;


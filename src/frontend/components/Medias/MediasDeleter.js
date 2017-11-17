import React from "react";
import { connect } from "react-redux";
import { Button } from "react-toolbox/lib/button"
import { Dialog } from "react-toolbox/lib/dialog"
import { ProgressBar } from 'react-toolbox/lib/progress_bar';

import { selectors } from "../../modules"
const { getSelectedMedias, getDeleteMediasState } = selectors;
import { actions } from "../../modules"
const { deleteMedias, resetDeleteMediasState } = actions;

import styles from './carousel.css'

class MediasDeleter extends React.Component {

	constructor(props) {
		super(props);
		this.handleDeleteMedias = this.handleDeleteMedias.bind(this);
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.deleteMediasState.data && !this.props.deleteMediasState.data) {
			// medias have just been deleted : reset request state
			this.props.dispatch(resetDeleteMediasState());
		} 
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
					<div>{`${pending.index}/${pending.length}`}</div>
				</div>
			</Dialog>
		</div>
	}
}

const ConnectedMediasDeleter = connect((store)=> {
	return {
		selectedMedias: getSelectedMedias(store),
		deleteMediasState: getDeleteMediasState(store)
	}
})(MediasDeleter);

export default ConnectedMediasDeleter;


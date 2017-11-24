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
		this.cancel = this.cancel.bind(this);
		this.retry = this.retry.bind(this);
		this.state = {
			deletePending: false,
			deleteFinished: false,
			deleteFulfilled: false,
			nbMedias: 0
		};
	}

	componentWillReceiveProps(nextProps) {
		const deletePending = nextProps.deleteMediasState.pending !== false;
		const deleteFinished = nextProps.deleteMediasState.data !== null;
		const deleteFulfilled = deleteFinished && !nextProps.deleteMediasState.error;

		if (deleteFulfilled) {
			// medias have been deleted successfully: reset server request
			this.props.dispatch(resetDeleteMediasState());
		}

		this.setState({ deletePending, deleteFinished, deleteFulfilled });
	}

	handleDeleteMedias() {
		this.setState({
			nbMedias: this.props.selectedMedias.length
		});
		this.props.dispatch(deleteMedias(this.props.selectedMedias));
	}

	cancel() {
		this.setState({
			deletePending: false,
			deleteFinished: false,
			deleteFulfilled: false,
			nbMedias: 0
		}, ()=> {
			this.props.dispatch(resetDeleteMediasState());
		});
	}

	retry() {
		const errorMedias = this.props.deleteMediasState.error.medias;
		if (errorMedias.length > 0) {
			this.setState({
				nbMedias: errorMedias.length
			});
	  		this.props.dispatch(deleteMedias(errorMedias));
		}
	}

	render() {
		const pending = this.props.deleteMediasState.pending;
		const dialogActive = this.state.deletePending || 
			(this.state.deleteFinished && !this.state.deleteFulfilled);

		var progressValue;
		var progressString;
		if (this.state.deletePending) {
			progressValue = parseInt(pending / this.state.nbMedias * 100);
			progressString = `${pending}/${this.state.nbMedias}`;
		} else if (this.state.deleteFinished) {
			progressValue = 100;
			progressString = `${this.state.nbMedias}/${this.state.nbMedias}`;
		}

		var successMessage;
		if (this.state.deleteFinished && this.props.deleteMediasState.data.length > 0) {
			successMessage = `Successfully deleted ${this.props.deleteMediasState.data.length}/${this.state.nbMedias} medias`;
		}

		var mappedErrors;
		if (this.props.deleteMediasState.error) {
			mappedErrors = this.props.deleteMediasState.error.messages.map((err, i)=> {
				return <div key={`err-${i}`}>{err}</div>
			});
		}

		return <div>
			<div className={styles.mediasUploader}>
				<Button accent 
					disabled={this.props.selectedMedias.length === 0}
					onClick={this.handleDeleteMedias}>
					Delete Medias
				</Button>
			</div>
			<Dialog active={dialogActive}
				title="Deleting medias">
				<div className={styles.mediasUploaderProgress}>
					<ProgressBar type="linear" 
						mode="determinate"
						value={progressValue}/>
					<div>{progressString}</div>
				</div>
				<div className={styles.mediasUploaderSuccess}>
					{successMessage}
				</div>
				{mappedErrors &&
					<div className={styles.mediasUploaderErrors}>
						{mappedErrors}
					</div>
				}
				{this.state.deleteFinished && !this.state.deleteFulfilled &&
					<div className={styles.mediasUploaderErrorActions}>
						<Button primary onClick={this.retry}>
							Retry
						</Button>
						<Button onClick={this.cancel}>
							Cancel
						</Button>
					</div>
				}
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


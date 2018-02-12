import React from 'react';
import { connect } from 'react-redux';
import { Button } from 'react-toolbox/lib/button';
import { Dialog } from 'react-toolbox/lib/dialog';
import { ProgressBar } from 'react-toolbox/lib/progress_bar';
import PropTypes from 'prop-types';

import { selectors } from '../../modules';
const { getUploadMediasState } = selectors;
import { actions } from '../../modules';
const { uploadMedias, resetUploadMediasState } = actions;

import styles from './carousel.css';

class MediasUploader extends React.Component {
    constructor(props) {
        super(props);
        this.handleFileUpload = this.handleFileUpload.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.cancel = this.cancel.bind(this);
        this.retry = this.retry.bind(this);
        this.state = {
            uploadPending: false,
            uploadFinished: false,
            uploadFulfilled: false,
            nbFiles: 0
        };
    }

    componentWillReceiveProps(nextProps) {
        const uploadPending = nextProps.uploadMediasState.pending !== false;
        const uploadFinished = nextProps.uploadMediasState.data !== null;
        const uploadFulfilled = uploadFinished && !nextProps.uploadMediasState.error;

        if (uploadFinished) {
            // some medias were uploaded : reset input value
            this.input.value = '';
        }

        if (uploadFulfilled) {
            // medias have been uploaded successfully: reset server request
            this.props.dispatch(resetUploadMediasState());
        }

        this.setState({ uploadPending, uploadFinished, uploadFulfilled });
    }

    handleFileUpload(event) {
        this.setState({
            nbFiles: event.target.files.length
        });
        this.props.dispatch(uploadMedias(event.target.files, this.props.position));
    }

    handleClick() {
        this.input.click();
    }

    cancel() {
        this.setState(
            {
                uploadPending: false,
                uploadFinished: false,
                uploadFulfilled: false,
                nbFiles: 0
            },
            () => {
                this.props.dispatch(resetUploadMediasState());
            }
        );
    }

    retry() {
        const errorFiles = this.props.uploadMediasState.error.files;
        if (errorFiles.length > 0) {
            this.setState({
                nbFiles: errorFiles.length
            });
            this.props.dispatch(uploadMedias(errorFiles, this.props.position));
        }
    }

    // shouldComponentUpdate(nextProps) {
    // 	// React does not need to re-render component
    // 	// when map position changes
    // 	// it should re-render only when uploadMediasState.pending changes
    // 	return (nextProps.uploadMediasState.pending !== this.props.uploadMediasState.pending);
    // }

    render() {
        const pending = this.props.uploadMediasState.pending;
        const dialogActive =
            this.state.uploadPending || (this.state.uploadFinished && !this.state.uploadFulfilled);

        let progressValue;
        let progressString;
        if (this.state.uploadPending) {
            progressValue = parseInt(pending / this.state.nbFiles * 100);
            progressString = `${pending}/${this.state.nbFiles}`;
        } else if (this.state.uploadFinished) {
            progressValue = 100;
            progressString = `${this.state.nbFiles}/${this.state.nbFiles}`;
        }

        let successMessage;
        if (this.state.uploadFinished && this.props.uploadMediasState.data.length > 0) {
            successMessage = `Successfully uploaded ${this.props.uploadMediasState.data.length}/${
                this.state.nbFiles
            } medias`;
        }

        let mappedErrors;
        if (this.props.uploadMediasState.error) {
            mappedErrors = this.props.uploadMediasState.error.messages.map((err, i) => {
                return <div key={`err-${i}`}>{err}</div>;
            });
        }

        return (
            <div>
                <div className={styles.mediasUploader}>
                    <input
                        type="file"
                        onChange={this.handleFileUpload}
                        multiple
                        ref={input => {
                            this.input = input;
                        }}
                    />
                    <Button primary onClick={this.handleClick}>
                        Upload medias
                    </Button>
                </div>
                <Dialog active={dialogActive} title="Uploading medias">
                    <div className={styles.mediasUploaderProgress}>
                        <ProgressBar type="linear" mode="determinate" value={progressValue} />
                        <div>{progressString}</div>
                    </div>
                    <div className={styles.mediasUploaderSuccess}>{successMessage}</div>
                    {mappedErrors && (
                        <div className={styles.mediasUploaderErrors}>{mappedErrors}</div>
                    )}
                    {this.state.uploadFinished &&
                        !this.state.uploadFulfilled && (
                            <div className={styles.mediasUploaderErrorActions}>
                                <Button primary onClick={this.retry}>
                                    Retry
                                </Button>
                                <Button onClick={this.cancel}>Cancel</Button>
                            </div>
                        )}
                </Dialog>
            </div>
        );
    }
}

MediasUploader.propTypes = {
    /** redux store dispatch function, provided by connect*/
    dispatch: PropTypes.func.isRequired,

    /** current map position, provided by connect (by default, medias will be uploaded with this position)*/
    position: PropTypes.shape({
        lng: PropTypes.number.isRequired,
        lat: PropTypes.number.isRequired
    }).isRequired,

    /** state of the request UPLOAD_MEDIAS, provided by connect*/
    uploadMediasState: PropTypes.shape({
        /** assigned if a request is on going (number corresponds to the index of the on going request in case of several medias)*/
        pending: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]).isRequired,
        /** object { files, errors } containing the files that could not be uploaded and the associated error messages*/
        error: PropTypes.shape({
            files: PropTypes.arrayOf(PropTypes.object),
            messages: PropTypes.arrayOf(PropTypes.string)
        }),
        /** contains successfully uploaded files once the request is finished*/
        data: PropTypes.arrayOf(PropTypes.object)
    }).isRequired
};

const ConnectedMediasUploader = connect(store => {
    return {
        position: {
            lng: store.world.lng,
            lat: store.world.lat
        },
        uploadMediasState: getUploadMediasState(store)
    };
})(MediasUploader);

export default ConnectedMediasUploader;

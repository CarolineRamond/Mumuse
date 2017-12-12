import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ProgressBar from 'react-toolbox/lib/progress_bar';
import SplitPane from 'react-split-pane';

import styles from './preview.css';
import Potree from '../Potree/Potree';
import { actions } from '../../modules';
import { selectors } from '../../modules';
const { switchPreviewMode } = actions;
const { getMapPreviewMode, getSelectedMedias, getSelectedPointCloud } = selectors;

class ImagePreviewer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: true
        };

        this.handleLoadComplete = this.handleLoadComplete.bind(this);
        this.handleLoadError = this.handleLoadError.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.media.properties._id !== this.props.media.properties._id) {
            // media did change => preload previewImg & fullImg
            this.setState({
                loading: true
            });
        }
        if (nextProps.previewMode !== this.props.previewMode) {
            this.setState({
                loading: true
            });
        }
    }

    handleLoadError(e) {
        // Use full media picture if preview is no available
        if (e.target.src === this.props.media.properties.preview_url) {
            e.target.src = this.props.media.properties.url;
        }
        this.setState({
            loading: false
        });
    }

    handleLoadComplete() {
        this.setState({
            loading: false
        });
    }

    render() {
        const imgUrl = !this.props.previewMode
            ? this.props.media.properties.preview_url
            : this.props.media.properties.url;

        return (
            <div className={styles.previewImageContainer}>
                {this.state.loading && (
                    <div className={styles.previewLoaderContainer}>
                        <ProgressBar type="circular" mode="indeterminate" />
                    </div>
                )}
                <img
                    className={styles.previewImage}
                    src={imgUrl}
                    onLoad={this.handleLoadComplete}
                    onError={e => this.handleLoadError(e)}
                />
            </div>
        );
    }
}

ImagePreviewer.propTypes = {
    media: PropTypes.shape({
        properties: PropTypes.object,
        geometry: PropTypes.object
    }).isRequired,
    previewMode: PropTypes.bool
};

class PointCloudPreviewer extends React.Component {
    constructor(props) {
        super(props);
        const pointCloud = this.props.pointCloud;
        this.state = {
            pointCloud: pointCloud
        };
    }

    render() {
        return <Potree className={styles.previewImageContainer} />;
    }
}

PointCloudPreviewer.propTypes = {
    pointCloud: PropTypes.object.isRequired
};

class Previewer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isResizing: false
        };

        this.handleDragStarted = this.handleDragStarted.bind(this);
        this.handleDragFinished = this.handleDragFinished.bind(this);
    }

    componentWillUnmount() {
        if (this.props.previewMode) {
            this.props.dispatch(switchPreviewMode());
        }
    }

    handleDragStarted() {
        this.setState({
            isResizing: true
        });
    }

    handleDragFinished() {
        this.setState({
            isResizing: false
        });
    }

    render() {
        const resizerStyle = {
            height: '12px',
            width: '100%',
            margin: 'auto',
            background: 'grey',
            borderLeft: '5px solid #ccc',
            cursor: 'ns-resize',
            zIndex: '1'
        };
        const resizerStyleHover = Object.assign({}, resizerStyle, {
            borderLeft: '5px solid blue'
        });

        // We define default empty pan, because the splitPan component do no work only with one pan.
        let firstPan = <div />;
        let secondPan = <div />;
        const isMediaSelected =
            this.props.media && this.props.media.properties.contentType === 'image' ? true : false;
        const isPointCloudSelected = this.props.pointCloud !== null;
        let defaultSize = '100%';
        let allowResize = false;

        if (isMediaSelected && !isPointCloudSelected) {
            firstPan = (
                <ImagePreviewer media={this.props.media} previewMode={this.props.previewMode} />
            );
        } else if (isPointCloudSelected && !isMediaSelected) {
            firstPan = (
                <PointCloudPreviewer
                    pointCloud={this.props.pointCloud}
                    previewMode={this.props.previewMode}
                />
            );
        } else if (isMediaSelected && isPointCloudSelected) {
            firstPan = (
                <ImagePreviewer media={this.props.media} previewMode={this.props.previewMode} />
            );
            secondPan = (
                <PointCloudPreviewer
                    pointCloud={this.props.pointCloud}
                    previewMode={this.props.previewMode}
                />
            );
            allowResize = true;
            defaultSize = '50%';
        }

        return (
            <SplitPane
                split="horizontal"
                defaultSize={defaultSize}
                allowResize={allowResize}
                resizerStyle={this.state.isResizing ? resizerStyleHover : resizerStyle}
                onDragStarted={this.handleDragStarted}
                onDragFinished={this.handleDragFinished}
            >
                {firstPan}
                {secondPan}
                )}
            </SplitPane>
            /*<div>
			{this.props.media.properties.contentType === 'image'
				&& <ImagePreviewer media={this.props.media}
				previewMode={this.props.previewMode}/>
			}
			{this.props.pointCloud &&
				<PointCloudPreviewer pointCloud={this.props.pointCloud}
				previewMode={this.props.previewMode} />
			}
			</div>
			*/
        );
    }
}

// Props :
// * media: currently selected media (if any),
//   inherited from MainPanel
// * pointCloud : currently selected pointcloud (if any),
//   inherited from MainPanel
// * previewMode : whether the previewer should be in preview mode (ie small) or not,
//   inherited from MainPanel
Previewer.propTypes = {
    dispatch: PropTypes.func.isRequired,
    media: PropTypes.shape({
        properties: PropTypes.object,
        geometry: PropTypes.object
    }),
    pointCloud: PropTypes.object,
    previewMode: PropTypes.bool
};

const ConnectedPreviewer = connect(store => {
    const selectedMedias = getSelectedMedias(store);
    const selectedPointCloud = getSelectedPointCloud(store);
    return {
        previewMode: getMapPreviewMode(store),
        showPreviewer: selectedMedias.length === 1 || selectedPointCloud !== null,
        media: selectedMedias[0],
        pointCloud: selectedPointCloud
    };
})(Previewer);

export default ConnectedPreviewer;

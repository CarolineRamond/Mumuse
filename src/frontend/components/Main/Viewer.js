import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import SplitPane from 'react-split-pane';
import MediaViewer from '../Medias/MediaViewer';
import PointCloudViewer from '../Potree/PointCloudViewer';
import { actions } from '../../modules';
import { selectors } from '../../modules';
const { switchPreviewMode } = actions;
const { getMapPreviewMode, getSelectedMedias, getSelectedPointCloud } = selectors;

class Viewer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isResizing: false
        };

        this.handleDragStarted = this.handleDragStarted.bind(this);
        this.handleDragFinished = this.handleDragFinished.bind(this);
        this.handleResize = this.handleResize.bind(this);
    }

    componentDidMount() {
        this.props.setResizeHandler(this.handleResize);
    }

    componentWillUnmount() {
        if (this.props.previewMode) {
            this.props.dispatch(switchPreviewMode());
        }
    }

    handleResize() {
        if (this.mediaViewerRef && this.mediaViewerRef.handleResize) {
            this.mediaViewerRef.handleResize();
        }
        if (this.pointCloudViewerRef && this.pointCloudViewerRef.handleResize) {
            if (this.props.previewMode) {
                this.pointCloudViewerRef.handleResize();
            }
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
        const isMediaSelected =
            this.props.media && this.props.media.properties.contentType === 'image' ? true : false;
        const isPointCloudSelected = this.props.pointCloud !== null;
        return (
            <div style={{ height: '100%', width: '100%' }}>
                {isMediaSelected &&
                    !isPointCloudSelected && (
                        <MediaViewer
                            ref={mediaViewerRef => {
                                this.mediaViewerRef = mediaViewerRef;
                            }}
                            media={this.props.media}
                            previewMode={this.props.previewMode}
                        />
                    )}
                {isPointCloudSelected && (
                    <PointCloudViewer
                        ref={pointCloudViewerRef => {
                            this.pointCloudViewerRef = pointCloudViewerRef;
                        }}
                        pointCloud={this.props.pointCloud}
                        previewMode={this.props.previewMode}
                    />
                )}
            </div>
        );
    }
}

Viewer.propTypes = {
    dispatch: PropTypes.func.isRequired,

    /** media: currently selected media (if any), provided by connect */
    media: PropTypes.shape({
        properties: PropTypes.object,
        geometry: PropTypes.object
    }),

    /** pointCloud : currently selected pointcloud (if any), provided by connect */
    pointCloud: PropTypes.object,

    /** previewMode : whether the previewer should be in preview mode (ie small) or not, provided by connect */
    previewMode: PropTypes.bool,

    /** function called on mount to transmit handleResize function to component's parent (MainPanel), inherited from MainPanel */
    setResizeHandler: PropTypes.func.isRequired
};

const ConnectedViewer = connect(store => {
    const selectedMedias = getSelectedMedias(store);
    const selectedPointCloud = getSelectedPointCloud(store);
    return {
        previewMode: getMapPreviewMode(store),
        media: selectedMedias[0],
        pointCloud: selectedPointCloud
    };
})(Viewer);

export default ConnectedViewer;

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

    componentWillUnmount() {
        if (this.props.previewMode) {
            this.props.dispatch(switchPreviewMode());
        }
    }

    handleResize() {
        this.mediaViewerRef.handleResize();
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
                        pointCloud={this.props.pointCloud}
                        previewMode={this.props.previewMode}
                    />
                )}
            </div>
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
Viewer.propTypes = {
    dispatch: PropTypes.func.isRequired,
    media: PropTypes.shape({
        properties: PropTypes.object,
        geometry: PropTypes.object
    }),
    pointCloud: PropTypes.object,
    previewMode: PropTypes.bool
};

const ConnectedViewer = connect(store => {
    const selectedMedias = getSelectedMedias(store);
    const selectedPointCloud = getSelectedPointCloud(store);
    return {
        previewMode: getMapPreviewMode(store),
        showViewer: selectedMedias.length === 1 || selectedPointCloud !== null,
        media: selectedMedias[0],
        pointCloud: selectedPointCloud
    };
})(Viewer);

export default ConnectedViewer;

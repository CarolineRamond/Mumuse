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
                <MediaViewer media={this.props.media} previewMode={this.props.previewMode} />
            );
        } else if (isPointCloudSelected && !isMediaSelected) {
            firstPan = (
                <PointCloudViewer
                    pointCloud={this.props.pointCloud}
                    previewMode={this.props.previewMode}
                />
            );
        } else if (isMediaSelected && isPointCloudSelected) {
            firstPan = (
                <MediaViewer media={this.props.media} previewMode={this.props.previewMode} />
            );
            secondPan = (
                <PointCloudViewer
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
                && <MediaViewer media={this.props.media}
                previewMode={this.props.previewMode}/>
            }
            {this.props.pointCloud &&
                <PointCloudViewer pointCloud={this.props.pointCloud}
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

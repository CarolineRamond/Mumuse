import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import InteractiveImage from '../Common/InteractiveImage';
import PotreeViewer from '../Potree/PotreeViewer/PotreeViewer';
import { actions } from '../../modules';
import { selectors } from '../../modules';
const { switchPreviewMode } = actions;
const { getMapPreviewMode, getSelectedMedias, getSelectedPointCloud } = selectors;

class Viewer extends React.Component {
    constructor(props) {
        super(props);
        this.handleResize = this.handleResize.bind(this);
    }

    componentDidMount() {
        this.props.setResizeHandler(this.handleResize);
        window.addEventListener('resize', this.handleResize);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.previewMode !== this.props.previewMode) {
            this.handleResize();
        }
    }

    shouldComponentUpdate(nextProps) {
        const didMediaChange =
            (this.props.media &&
                nextProps.media &&
                this.props.media.properties._id !== nextProps.media.properties._id) ||
            (this.props.media && !nextProps.media) ||
            (!this.props.media && nextProps.media);
        const didPointCloudChange =
            (this.props.pointCloud &&
                nextProps.pointCloud &&
                this.props.pointCloud.properties._id !== nextProps.pointCloud.properties._id) ||
            (this.props.pointCloud && !nextProps.pointCloud) ||
            (!this.props.pointCloud && nextProps.pointCloud);
        return (
            didMediaChange ||
            didPointCloudChange ||
            this.props.previewMode !== nextProps.previewMode
        );
    }

    componentWillUnmount() {
        if (!this.props.previewMode) {
            this.props.dispatch(switchPreviewMode());
        }
    }

    handleResize() {
        if (this.handleMediaResize) {
            this.handleMediaResize();
        }
        if (this.handlePotreeResize) {
            this.handlePotreeResize();
        }
    }

    render() {
        const isMediaSelected =
            this.props.media && this.props.media.properties.contentType === 'image' ? true : false;
        return (
            <div
                style={{ height: '100%', width: '100%' }}
                ref={el => {
                    this.viewerElement = el;
                }}
            >
                {isMediaSelected &&
                    !this.props.pointCloud && (
                        <InteractiveImage
                            setResizeHandler={resizeHandler => {
                                this.handleMediaResize = resizeHandler;
                            }}
                            mediaUrl={
                                this.props.previewMode
                                    ? this.props.media.properties.preview_url
                                    : this.props.media.properties.url
                            }
                            fallbackMediaUrl={this.props.media.properties.url}
                            interactive
                        />
                    )}
                {this.props.pointCloud && (
                    <PotreeViewer
                        setResizeHandler={resizeHandler => {
                            this.handlePotreeResize = resizeHandler;
                        }}
                    />
                )}
            </div>
        );
    }
}

Viewer.propTypes = {
    dispatch: PropTypes.func.isRequired,

    /** currently selected media (if any), provided by connect */
    media: PropTypes.shape({
        properties: PropTypes.object,
        geometry: PropTypes.object
    }),

    /** currently selected pointcloud (if any), provided by connect */
    pointCloud: PropTypes.object,

    /** whether the viewer is in preview mode (ie small) or not, provided by connect */
    previewMode: PropTypes.bool,

    /** function called on mount to transmit handleResize function to component's parent (MainPanel), inherited from MainPanel */
    setResizeHandler: PropTypes.func.isRequired
};

const ConnectedViewer = connect(store => {
    const selectedMedias = getSelectedMedias(store);
    const selectedPointCloud = getSelectedPointCloud(store);
    return {
        previewMode: !getMapPreviewMode(store),
        media: selectedMedias[0],
        pointCloud: selectedPointCloud
    };
})(Viewer);

export default ConnectedViewer;

import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import InteractiveCanvas from '../Potree/MediaViewer/InteractiveCanvas';
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

    componentWillUnmount() {
        if (this.props.previewMode) {
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
                        <InteractiveCanvas
                            setResizeHandler={resizeHandler => {
                                this.handleMediaResize = resizeHandler;
                            }}
                            mediaUrl={{
                                src: this.props.media.properties.url,
                                quarter: 0
                            }}
                            interactive={true}
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

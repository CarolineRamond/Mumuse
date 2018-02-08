import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { selectors } from '../../modules';
const { getSelectedMedias, getMapPreviewMode, getSelectedPointCloud } = selectors;
import Map from '../Map';
import PreviewSwitch from './ViewerSwitch';
import Viewer from './Viewer';
import Timeline from '../Medias/Timeline';
import styles from './main.css';

class MainPanel extends React.Component {
    componentDidMount() {
        this.props.setResizeHandler(this.handleResize.bind(this));
    }

    handleResize() {
        if (this.handleMapResize) {
            if (!this.props.mapPreviewMode) {
                this.handleMapResize();
            }
        }
        if (this.handleViewerResize) {
            this.handleViewerResize();
        }
    }

    render() {
        const mapClass = this.props.mapPreviewMode ? styles.preview : styles.main;
        const viewerClass = this.props.mapPreviewMode ? styles.main : styles.preview;
        return (
            <div className={styles.mainContainer}>
                {/*Map*/}
                <div className={mapClass}>
                    <Map
                        setResizeHandler={resizeHandler => {
                            this.handleMapResize = resizeHandler;
                        }}
                    />
                    {this.props.mapPreviewMode && <PreviewSwitch />}
                </div>
                {/*Timeline*/}
                {!this.props.mapPreviewMode && (
                    <div className={styles.timelineContainer}>
                        {this.props.showViewer && <div className={styles.dummyPreview} />}
                        <Timeline />
                    </div>
                )}
                {/*Viewer*/}
                {this.props.showViewer && (
                    <div className={viewerClass}>
                        {!this.props.mapPreviewMode && <PreviewSwitch />}
                        <Viewer
                            setResizeHandler={resizeHandler => {
                                this.handleViewerResize = resizeHandler;
                            }}
                        />
                    </div>
                )}
            </div>
        );
    }
}

MainPanel.propTypes = {
    /** whether map is in preview mode or in full mode, provided by connect */
    mapPreviewMode: PropTypes.bool.isRequired,

    /** function called on mount to transmit handleResize function to component's parent (Main), inherited from Main */
    setResizeHandler: PropTypes.func.isRequired,

    /**  whether viewer should be shown (ie if there is exactly one selected media or a selected point cloud) */
    showViewer: PropTypes.bool.isRequired
};

// Store connection
const MainPanelConnected = connect(store => {
    const selectedMedias = getSelectedMedias(store);
    const selectedPointCloud = getSelectedPointCloud(store);
    return {
        mapPreviewMode: getMapPreviewMode(store),
        showViewer: selectedMedias.length === 1 || selectedPointCloud !== null
    };
})(MainPanel);

export default MainPanelConnected;

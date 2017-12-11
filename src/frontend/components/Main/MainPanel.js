import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { selectors } from '../../modules';
const { getSelectedMedias, getMapPreviewMode, getSelectedPointCloud } = selectors;
import Map from '../Map';
import PreviewSwitch from '../Medias/PreviewSwitch';
import Previewer from '../Medias/Previewer';
import Timeline from '../Medias/Timeline';
import styles from './main.css';

class MainPanel extends React.Component {
    render() {
        const mapClass = this.props.previewMode ? styles.preview : styles.main;
        const previewerClass = this.props.previewMode ? styles.main : styles.preview;
        return (
            <div className={styles.mainContainer}>
                {/*Map*/}
                <div className={mapClass}>
                    <Map />
                    {this.props.previewMode && <PreviewSwitch />}
                </div>
                {/*Timeline*/}
                {!this.props.previewMode && (
                    <div className={styles.timelineContainer}>
                        {this.props.showPreviewer && <div className={styles.dummyPreview} />}
                        <Timeline />
                    </div>
                )}
                {/*Previewer*/}
                {this.props.showPreviewer && (
                    <div className={previewerClass}>
                        {!this.props.previewMode && <PreviewSwitch />}
                        <Previewer />
                    </div>
                )}
            </div>
        );
    }
}

// Props :
// * previewMode: whether map is in preview mode or in full mode, provided by connect (required)
// * selectedMedias: array of selected media features, provided by connect (required)
// * selectedPointCloud: currently selected point cloud, provided by connect (required)
// * showPreviewer : whether previewer should be shown
//  (ie if there is exactly one selected media or a selected point cloud)
MainPanel.propTypes = {
    previewMode: PropTypes.bool.isRequired,
    showPreviewer: PropTypes.bool.isRequired
};

// Store connection
const MainPanelConnected = connect(store => {
    const selectedMedias = getSelectedMedias(store);
    const selectedPointCloud = getSelectedPointCloud(store);
    return {
        previewMode: getMapPreviewMode(store),
        showPreviewer: selectedMedias.length === 1 || selectedPointCloud !== null
    };
})(MainPanel);

export default MainPanelConnected;

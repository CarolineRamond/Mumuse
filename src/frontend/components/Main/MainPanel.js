import React from "react";
import { connect } from "react-redux"
import PropTypes from "prop-types"

import { selectors } from "../../modules"
const { getSelectedMedias, getMapPreviewMode } = selectors;
import Map from '../Map'
import PreviewSwitch from '../Medias/PreviewSwitch'
import Previewer from '../Medias/Previewer'
import Timeline from '../Medias/Timeline'
import styles from './main.css'


class MainPanel extends React.Component {

    render() {
        const mapClass = this.props.previewMode ? styles.preview : styles.main;
        const previewerClass = this.props.previewMode ? styles.main : styles.preview;
        return <div class={styles.mainContainer}>
            {/*Map*/} 
            <div className={mapClass}>
                <Map/>
                { this.props.previewMode && <PreviewSwitch/> }
            </div>
            {/*Timeline*/} 
            { !this.props.previewMode && 
                <div className={styles.timelineContainer}>
                    { this.props.showPreviewer && <div className={styles.dummyPreview}/>}
                    <Timeline/>
                </div> 
            }
            {/*Previewer*/}
            { this.props.showPreviewer &&
                <div className={previewerClass}>
                    { !this.props.previewMode && <PreviewSwitch/> }
                    <Previewer media={this.props.selectedMedias[0]} pointCloud={this.props.selectedPointCloud}
                        previewMode={!this.props.previewMode}/>
                </div>
            }
        </div>
    }
}

// Props :
// * previewMode: whether map is in preview mode or in full mode, provided by connect (required)
// * showPreviewer : whether previewer should be shown (ie if there is exactly one selected media)
// * selectedMedias: array of selected media features, provided by connect (required)
MainPanel.propTypes = {
    previewMode: PropTypes.bool.isRequired,
    showPreviewer: PropTypes.bool.isRequired,
    selectedPointCloud: PropTypes.object.isRequired,
    selectedMedias: PropTypes.arrayOf(PropTypes.shape({
        properties: PropTypes.object,
        geometry: PropTypes.object
    })).isRequired
}

// Store connection
const MainPanelConnected = connect((store)=> {
    const selectedMedias = getSelectedMedias(store);
    const isPointCloudSelected = Object.keys(store.potree.pointCloud).length !== 0 && store.potree.pointCloud.constructor === Object;
    return  {
        previewMode: getMapPreviewMode(store),
        showPreviewer: (selectedMedias.length === 1 || isPointCloudSelected),
        selectedMedias: selectedMedias,
        selectedPointCloud : store.potree.pointCloud
    }
})(MainPanel);

export default MainPanelConnected;
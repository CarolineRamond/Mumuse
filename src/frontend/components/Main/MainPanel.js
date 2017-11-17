import React from "react";
import { connect } from "react-redux"
import PropTypes from "prop-types"

import { selectors } from "../../modules"
const { getSelectedMedias } = selectors;
import Map from '../Map'
import PreviewSwitch from '../Medias/PreviewSwitch'
import Previewer from '../Medias/Previewer'
import Timeline from '../Medias/Timeline'
import styles from './main.css'


class MainPanel extends React.Component {

    render() {
        const mapClass = this.props.previewMode ? styles.preview : styles.mainContainer;
        const previewerClass = this.props.previewMode ? styles.mainContainer : styles.preview;
        return <div>
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
                    <Previewer media={this.props.selectedMedias[0]}
                        previewMode={!this.props.previewMode}/>
                </div>
            }
        </div>
    }
}

// Props :
// * previewMode: whether map is in preview mode or in full mode (required)
// * selectedMedias: array of selected media features (required)
MainPanel.propTypes = {
    previewMode: PropTypes.bool.isRequired,
    showPreviewer: PropTypes.bool.isRequired,
    // selectedMedias: PropTypes.arrayOf(PropTypes.instanceOf(Feature)).isRequired
    selectedMedias: PropTypes.arrayOf(PropTypes.object).isRequired
}

// Store connection
const MainPanelConnected = connect((store)=> {
    const selectedMedias = getSelectedMedias(store);
    return  {
        previewMode: store.world.previewMode,
        showPreviewer: (selectedMedias.length === 1),
        selectedMedias: selectedMedias 
    }
})(MainPanel);

export default MainPanelConnected;
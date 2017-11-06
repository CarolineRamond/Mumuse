import React from "react";
import { connect } from "react-redux"

import Map from '../Map'
import PreviewSwitch from '../Medias/PreviewSwitch'
import Previewer from '../Medias/Previewer'
import Timeline from '../Medias/Timeline'
import styles from './main.css'
import { mapConfig } from '../../modules'
import { getSelectedMedias } from '../../modules/medias'

@connect((store)=> {
    return  {
        previewMode: store.world.previewMode,
        selectedMedias: getSelectedMedias(store.medias) 
    }
})
class MapScreen extends React.Component {
    render() {
        const mapClass = this.props.previewMode ? styles.preview : styles.mainContainer;
        const previewerClass = this.props.previewMode ? styles.mainContainer : styles.preview;
        const hasSelectedMedia = (this.props.selectedMedias.length === 1);
        return <div>
            {/*Map*/} 
            <div className={mapClass}>
                <Map config={mapConfig}></Map>
                { this.props.previewMode && <PreviewSwitch/> }
            </div>
            {/*Timeline*/} 
            { !this.props.previewMode && 
                <div className={styles.timelineContainer}>
                    { hasSelectedMedia && <div className={styles.dummyPreview}/>}
                    <Timeline/>
                </div> 
            }
            {/*Previewer*/} 
            { hasSelectedMedia &&
                <div className={previewerClass}>
                    { !this.props.previewMode && <PreviewSwitch/> }
                    <Previewer media={this.props.selectedMedias[0]}/>
                </div>
            }
        </div>
    }
}

export default MapScreen;
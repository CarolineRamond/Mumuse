import React from "react";
import { connect } from "react-redux"
import { Link } from "react-router-dom"
import Button from "react-toolbox/lib/button"
import SplitPane from "react-split-pane"

import Map from '../Map'
import PreviewSwitch from './PreviewSwitch'
import Previewer from '../Medias/Previewer'
import Timeline from '../Medias/Timeline'
import SidePannel from './SidePannel'
import AuthButton from '../Auth/AuthButton'
import { mapConfig } from '../../modules'
import styles from './layout.css'
import { resizeMap } from '../../modules/world/world.actions'
import { getSelectedMedias } from '../../modules/medias'

@connect((store)=> {
	return  {
		previewMode: store.world.previewMode,
		selectedMedias: getSelectedMedias(store.medias) 
	}
})

export default class Layout extends React.Component {
	constructor(props) {
		super(props);
		this.handleDragStarted = this.handleDragStarted.bind(this);
		this.handleDragFinished = this.handleDragFinished.bind(this);
		this.state = {
			isResizing: false
		}
	}

	handleDragStarted(props) {
		this.setState({
			isResizing: true
		});
	}

	handleDragFinished(props) {
		this.props.dispatch(resizeMap());
		this.setState({
			isResizing: false
		});
	}

	render() {
		const resizerStyle = {
			width:"12px", 
			background:"transparent", 
			borderLeft: "5px solid #ccc", 
			cursor: "ew-resize"
		}
		const resizerStyleHover = Object.assign({}, resizerStyle, {
			borderLeft: "5px solid blue"
		});
		return <SplitPane split="vertical" defaultSize="70%"
	    	minSize={750}
	    	resizerStyle={this.state.isResizing ? resizerStyleHover : resizerStyle}
	    	onDragStarted={this.handleDragStarted}
	    	onDragFinished={this.handleDragFinished}>
	    	<MapScreen location={this.props.location}
	    		history={this.props.history}
	    		previewMode={this.props.previewMode}
	    		selectedMedias={this.props.selectedMedias}/>
	    	<SidePannel location={this.props.location}/>
	    </SplitPane>
	}
}

const MapScreen =({location, history, previewMode, selectedMedias})=> {
	const mapClass = previewMode ? styles.preview : styles.mainContainer;
	const previewerClass = previewMode ? styles.mainContainer : styles.preview;
	const hasSelectedMedia = (selectedMedias.length === 1);
	return <div>
    	<AuthButton location={location}/>
    	<div className={mapClass}>
    		<Map config={mapConfig} 
    			location={location} 
    			history={history}>
    		</Map>
    		{ previewMode && <PreviewSwitch/> }
			{ !previewMode && 
				<div className={styles.timelineContainer}>
					{ hasSelectedMedia && <div className={styles.dummyPreview}/>}
					<Timeline/>
				</div> 
			}
    	</div>
    	{ hasSelectedMedia &&
    		<div className={previewerClass}>
    			{ !previewMode && <PreviewSwitch/> }
    			<Previewer media={selectedMedias[0]}/>
    		</div>
    	}
    </div>
}
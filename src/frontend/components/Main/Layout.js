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
			cursor: "ew-resize",
			zIndex: "2"
		}
		const resizerStyleHover = Object.assign({}, resizerStyle, {
			borderLeft: "5px solid blue"
		});
		return <div>
	    	<AuthButton/>
			<SplitPane split="vertical" defaultSize="70%"
		    	minSize={750}
		    	resizerStyle={this.state.isResizing ? resizerStyleHover : resizerStyle}
		    	onDragStarted={this.handleDragStarted}
		    	onDragFinished={this.handleDragFinished}>
		    	<MapScreen previewMode={this.props.previewMode}
		    		selectedMedias={this.props.selectedMedias}/>
		    	<SidePannel/>
		    </SplitPane>
		</div>
	}
}


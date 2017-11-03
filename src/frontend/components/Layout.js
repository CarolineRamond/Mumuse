import React from "react";
import { connect } from "react-redux"
import { Link } from "react-router-dom"
import Button from "react-toolbox/lib/button"
import SplitPane from "react-split-pane"

import Map from './Map'
import Preview from './Preview'
import Timeline from './Timeline'
import Pannel from './Pannel'
import { mapConfig } from '../modules'
import styles from '../css/layout.css'
import { logout } from '../modules/auth/auth.actions'
import { resizeMap, switchPreviewMode } from '../modules/world/world.actions'
import { getSelectedMedias } from '../modules/medias'

@connect((store)=> {
	return {
		user: store.auth.user,
		previewMode: store.world.previewMode,
		selectedMedias: getSelectedMedias(store.medias) 
	}
})

export default class Layout extends React.Component {
	constructor(props) {
		super(props);
		this.logout = this.logout.bind(this);
		this.handleResizePannel = this.handleResizePannel.bind(this);
		this.switchPreviewMode = this.switchPreviewMode.bind(this);
	}

	handleResizePannel(props) {
		this.props.dispatch(resizeMap());
	}

	switchPreviewMode(props) {
		this.props.dispatch(switchPreviewMode());
	}

	logout() {
		this.props.dispatch(logout());
	}

	render() {
		var authButton;
		if (this.props.user) {
			authButton = <Button icon='directions_run' onClick={this.logout}
				floating className={styles.authButton}/>
		} else {
			const loginUrl = this.props.location.pathname + '/auth/login';
			authButton = <Link to={loginUrl}>
				<Button icon='account_box' floating className={styles.authButton}/>
			</Link>
		}
		const mapClass = this.props.previewMode ? styles.preview : styles.mainContainer;
		var mapSwitchButton = <div/>
		if (this.props.previewMode) {
			mapSwitchButton = <button className={styles.previewSwitch} onClick={this.switchPreviewMode}></button>
		}
		var previewerComponent = <div/>
		if (this.props.selectedMedias.length === 1) {
			const previewerClass = !this.props.previewMode ? styles.preview : styles.mainContainer;
			var previewerSwitchButton = <div/>
			if (!this.props.previewMode) {
				previewerSwitchButton = <button className={styles.previewSwitch} onClick={this.switchPreviewMode}></button>
			}
			previewerComponent = <div className={previewerClass}>
				<div>coucou</div>
				{previewerSwitchButton}
			</div>
		}
		
		var timelineComponent = <div/>
		if (!this.props.previewMode) {
			var dummyPreview = <div/>
			if (this.props.selectedMedias.length === 1) {
				dummyPreview = <div className={styles.dummyPreview}/>
			}
			timelineComponent = <div className={styles.timelineContainer}>
				{dummyPreview}
				<Timeline/>
			</div>
		}
		return <SplitPane split="vertical" defaultSize="70%"
	    	minSize={750}
	    	resizerStyle={{border: "2px solid blue"}}
	    	onDragFinished={this.handleResizePannel}>
	        <div>
	        	{authButton}
	        	<div className={mapClass}>
	        		<Map config={mapConfig} location={this.props.location} 
	        		history={this.props.history}></Map>
	        		{mapSwitchButton}
	        	</div>
				{previewerComponent}
				{timelineComponent}
	        </div>
	        <Pannel/>
	    </SplitPane>
	}
}


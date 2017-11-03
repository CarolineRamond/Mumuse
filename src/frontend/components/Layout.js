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
import { resizeMap } from '../modules/world/world.actions'

@connect((store)=> {
	return {
		user: store.auth.user
	}
})

export default class Layout extends React.Component {
	constructor(props) {
		super(props);
		this.logout = this.logout.bind(this);
		this.handleResizePannel = this.handleResizePannel.bind(this);
	}

	handleResizePannel(props) {
		this.props.dispatch(resizeMap());
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
		return <SplitPane split="vertical" defaultSize="70%"
	    	minSize={500}
	    	resizerStyle={{border: "2px solid blue"}}
	    	onDragFinished={this.handleResizePannel}>
	        <div>
	        	<Map config={mapConfig} location={this.props.location} history={this.props.history}></Map>
				<Timeline></Timeline>
				<Preview></Preview>
				{authButton}
	        </div>
	        <Pannel/>
	    </SplitPane>
	}
}


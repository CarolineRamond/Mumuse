import React from "react";
import { connect } from "react-redux"
import { Link } from "react-router-dom"
import Button from "react-toolbox/lib/button"

import Map from './Map'
import Pannel from './Pannel'
import Preview from './Preview'
import Timeline from './Timeline'
import { mapConfig } from '../modules'
import styles from '../css/layout.css'
import { logout } from '../modules/auth/auth.actions'

@connect((store)=> {
	return {
		auth: store.auth
	}
})

export default class Layout extends React.Component {
	constructor(props) {
		super(props);

		this.logout = this.logout.bind(this);
	}

	logout() {
		this.props.dispatch(logout());
	}

	render() {
		var authButton;
		if (this.props.auth) {
			authButton = <Button icon='directions_run' onClick={this.logout}
				floating className={styles.authButton}/>
		} else {
			authButton = <Link to="/auth/login">
				<Button icon='account_box' floating className={styles.authButton}/>
			</Link>
		}
		return <div>
			<Map config={mapConfig}></Map>
			<Pannel></Pannel>
			<Timeline></Timeline>
			<Preview></Preview>
			{authButton}
		</div>
	}
}


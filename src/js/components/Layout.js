import React from "react";
import { connect } from "react-redux"
import { Link } from "react-router-dom"
import Button from "material-ui/Button"
import Tooltip from "material-ui/Tooltip"

import Map from './Map'
import Pannel from './Pannel'
import Preview from './Preview'
import Timeline from './Timeline'
import { mapConfig } from '../modules'
import '../../css/layout.css'

export default class Layout extends React.Component {
	render() {
		return <div className="layout">
			<Map config={mapConfig}></Map>
			<Pannel></Pannel>
			<Timeline></Timeline>
			<Preview></Preview>
				<Link to="/auth/login">
					<Tooltip title="Login" placement="bottom">
						<Button fab mini className="auth-button">
							<i className="material-icons">account_box</i>
						</Button>
					</Tooltip>
				</Link>
			
		</div>
	}
}
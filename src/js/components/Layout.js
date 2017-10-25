import React from "react";
import { connect } from "react-redux"

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
		</div>
	}
}
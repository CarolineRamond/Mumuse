import React from "react";
import { connect } from "react-redux"

import Map from './Map'
import Pannel from './Pannel'
import Preview from './Preview'
import '../../css/layout.css'

export default class Layout extends React.Component {
	render() {
		return <div className="layout">
			<Map></Map>
			<Pannel></Pannel>
			<Preview></Preview>
		</div>
	}
}
import React from "react";
import { connect } from "react-redux"

import Map from './Map'
import Pannel from './Pannel'
import '../../css/layout.css'

export default class Layout extends React.Component {
	render() {
		return <div className="layout">
			<Map className="map"></Map>
			<Pannel className="pannel"></Pannel>
		</div>
	}
}
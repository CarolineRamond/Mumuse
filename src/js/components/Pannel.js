import React from "react";
import { connect } from "react-redux"

import '../../css/pannel.css'

// this is to set up component's props
// component's props will be an excerpt
// of the store
// + some functions like dispatch (to fire actions)
@connect((store)=> {
	return store.world
})

export default class Pannel extends React.Component {
	render() {
		return <div className="pannel">
			<div>Latitude: {this.props.lat}</div>
			<div>Longitude: {this.props.long}</div>
			<div>Zoom: {this.props.zoom}</div>
		</div>
	}
}
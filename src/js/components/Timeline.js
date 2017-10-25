import React from "react";
import { connect } from "react-redux"

import '../../css/timeline.css'
import { getViewportMediaCount, getMediasMinDate } from '../modules/medias'

// this is to set up component's props
// component's props will be an excerpt
// of the store
// + some functions like dispatch (to fire actions)
@connect((store)=> {
	return  {
		viewportMediaCount: getViewportMediaCount(store.medias),
		minDate: getMediasMinDate(store.medias)
	}
})

export default class Timeline extends React.Component {

	constructor(props) {
		super(props);
		var now = Date.now();
		this.state = { maxDate: now, value: now };
		this.handleSlideChange = this.handleSlideChange.bind(this);
	}

	handleSlideChange(event) {
		this.setState({ value: parseInt(event.target.value) });
		this.props.dispatch({ type: 'TIMELINE_CHANGE', payload: { value: parseInt(event.target.value) } });
	}

	render() {
		var strValue = new Date(this.state.value).toLocaleDateString();
		return <div className="timeline">
			<div className="timeline-infos">
				<div className="timeline-date">{strValue}</div>
				<div className="timeline-count">
					{this.props.viewportMediaCount} media(s) in this zone
				</div>
			</div>
			<input className="timeline-slider" type="range" 
				min={this.props.minDate} max={this.state.maxDate}
				value={this.state.value}
				onChange={this.handleSlideChange}>
			</input>
		</div>
	}
}
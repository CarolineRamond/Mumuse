import React from "react";
import { connect } from "react-redux"
import Slider from "react-toolbox/lib/slider"
import PropTypes from "prop-types"

import styles from './timeline.css'
import { getViewportMediaCount, getMediasMinDate, getTimelineValue } from '../../modules/medias'
import { updateTimelineMedias } from "../../modules/medias/medias.actions"


class Timeline extends React.Component {

	constructor(props) {
		super(props);
		this.state = { 
			maxDate: Date.now(), 
			value: this.props.value, 
			minDate: this.props.minDate 
		};
		this.handleSlideChange = this.handleSlideChange.bind(this);
	}

	handleSlideChange(value) {
		this.setState({
			value: value
		});
		this.props.dispatch(updateTimelineMedias(parseInt(value)));
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.minDate <= this.state.value) {
			this.setState({  
				minDate: nextProps.minDate
			});
		}
	}

	render() {
		var strValue = new Date(this.state.value).toLocaleDateString();
		return <div className={styles.timeline}>
			<div className={styles.timelineInfos}>
				<div className={styles.timelineDate}>{strValue}</div>
				<div className={styles.timelineCount}>
					{this.props.viewportMediaCount} media(s) in this zone
				</div>
			</div>
			<Slider min={this.state.minDate} max={this.state.maxDate}
				value={this.state.value} onChange={this.handleSlideChange}/>
		</div>
	}
}

// Props :
// * viewportMediaCount : ready to display viewport media count 
// (string with ~ if approximative count) ; provided by @connect (required)
// * value : current slider value, provided by @connect (required)
// * minDate : minimum date of the visible medias, provided by @connect (required) 
Timeline.propTypes = {
	viewportMediaCount: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.number
	]).isRequired,
	value: PropTypes.number.isRequired,
	minDate: PropTypes.number.isRequired
}

// Store connection
const ConnectedTimeline = connect((store)=> {
	return  {
		viewportMediaCount: getViewportMediaCount(store.medias),
		value: getTimelineValue(store.medias),
		minDate: getMediasMinDate(store.medias)
	}
})(Timeline);

export default ConnectedTimeline;
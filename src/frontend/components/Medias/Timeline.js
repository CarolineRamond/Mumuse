import React from 'react';
import { connect } from 'react-redux';
import Slider from 'react-toolbox/lib/slider';
import PropTypes from 'prop-types';

import { selectors } from '../../modules';
const { getViewportMediaCount, getMediasMinDate, getTimelineValue } = selectors;
import { actions } from '../../modules';
const { updateTimelineMedias } = actions;

import styles from './timeline.css';

class Timeline extends React.Component {

	constructor (props) {
		super(props);
		this.state = {
			value: this.props.value,
			minDate: this.props.minDate,
			maxDate: Date.now()
		};
		this.handleSlideChange = this.handleSlideChange.bind(this);
	}

	componentWillReceiveProps (nextProps) {
		this.setState({
			minDate: nextProps.minDate,
			maxDate: Date.now()
		});
	}

	handleSlideChange (value) {
		this.setState({
			value: value
		});
		this.props.dispatch(updateTimelineMedias({ value: parseInt(value) }));
	}

	render () {
		const strValue = new Date(this.state.value).toLocaleDateString();
		return <div className={styles.timeline}>
			<div className={styles.timelineInfos}>
				<div className={styles.timelineDate}>{strValue}</div>
				<div className={styles.timelineCount}>
					{this.props.viewportMediaCount} media(s) in this zone
				</div>
			</div>
			<Slider min={this.state.minDate} max={this.state.maxDate}
				value={this.state.value} onChange={this.handleSlideChange}/>
		</div>;
	}
}

// Props :
// * dispatch: redux store dispatch function, provided by connect (required)
// * minDate : minimum date of the visible medias, provided by connect (required)
// * value : current slider value, provided by connect (required)
// * viewportMediaCount : ready to display viewport media count
//   (string with ~ if approximative count) ; provided by connect (required)
Timeline.propTypes = {
	dispatch: PropTypes.func.isRequired,
	minDate: PropTypes.number.isRequired,
	value: PropTypes.number.isRequired,
	viewportMediaCount: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.number
	]).isRequired
};

// Store connection
const ConnectedTimeline = connect((store)=> {
	return {
		viewportMediaCount: getViewportMediaCount(store),
		value: getTimelineValue(store),
		minDate: getMediasMinDate(store)
	};
})(Timeline);

export default ConnectedTimeline;

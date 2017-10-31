import React from "react";
import { connect } from "react-redux"
import Slider from "react-toolbox/lib/slider"

import styles from '../css/timeline.css'
import { getViewportMediaCount, getMediasMinDate, getTimelineValue } from '../modules/medias'
import { updateTimelineMedias } from "../modules/medias/medias.actions"
// this is to set up component's props
// component's props will be an excerpt
// of the store
// + some functions like dispatch (to fire actions)
@connect((store)=> {
	return  {
		viewportMediaCount: getViewportMediaCount(store.medias),
		value: getTimelineValue(store.medias),
		minDate: getMediasMinDate(store.medias)
	}
})

export default class Timeline extends React.Component {

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
		this.setState({  
			minDate: nextProps.minDate 
		});
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




// <Slider value={4} min={0} max={10}/>
// 			<Button raised primary>coucou</Button>
import React from "react";
import { connect } from "react-redux"
import SplitPane from "react-split-pane"

import styles from './main.css'
import { resizeMap } from '../../modules/world/world.actions'
import AuthButton from '../Auth/AuthButton'
import MainPanel from './MainPanel'
import SidePanel from './SidePanel'

class Main extends React.Component {
	constructor(props) {
		super(props);
		this.handleDragStarted = this.handleDragStarted.bind(this);
		this.handleDragFinished = this.handleDragFinished.bind(this);
		this.state = {
			isResizing: false
		}
	}

	handleDragStarted(props) {
		this.setState({
			isResizing: true
		});
	}

	handleDragFinished(props) {
		this.props.dispatch(resizeMap());
		this.setState({
			isResizing: false
		});
	}

	render() {
		const resizerStyle = {
			width:"12px", 
			background:"transparent", 
			borderLeft: "5px solid #ccc", 
			cursor: "ew-resize",
			zIndex: "1"
		}
		const resizerStyleHover = Object.assign({}, resizerStyle, {
			borderLeft: "5px solid blue"
		});
		return <div>
	    	<AuthButton/>
			<SplitPane split="vertical" defaultSize="70%"
		    	minSize={750}
		    	resizerStyle={this.state.isResizing ? resizerStyleHover : resizerStyle}
		    	onDragStarted={this.handleDragStarted}
		    	onDragFinished={this.handleDragFinished}>
		    	<MainPanel/>
		    	<SidePanel/>
		    </SplitPane>
		</div>
	}
}

// Store connection (to dispatch resizeMap action)
const ConnectedMain = connect((store)=> {
    return  {}
})(Main);

export default ConnectedMain;

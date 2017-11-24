import React from "react";
import { connect } from "react-redux"

import { actions } from "../../modules"
const { switchPreviewMode }= actions;

import styles from './preview.css'

@connect((store)=> {
	return  {}
})

export default class PreviewSwitch extends React.Component {

	constructor(props) {
		super(props);
		this.switchPreviewMode = this.switchPreviewMode.bind(this);
	}

	switchPreviewMode() {
		this.props.dispatch(switchPreviewMode());
	}

	render() {
		return <button 
			className={styles.previewSwitch} 
			onClick={this.switchPreviewMode}>
		</button>
	}
}
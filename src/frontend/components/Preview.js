import React from "react";
import { connect } from "react-redux"

import { getSelectedMedias } from '../modules/medias'
import styles from '../css/preview.css'

// this is to set up component's props
// component's props will be an excerpt
// of the store
// + some functions like dispatch (to fire actions)
// also, this will be rendered each time store changes
@connect((store)=> {
	return  {
		selectedMedias: getSelectedMedias(store.medias)
	}
})

export default class Preview extends React.Component {
	render() {
		if (this.props.selectedMedias.length === 1) {
			return <div className={styles.preview}>
				{this.props.selectedMedias[0].name}
			</div>
		}
		return <div></div>;
	}
}
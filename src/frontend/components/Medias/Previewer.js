import React from "react";

import { getSelectedMedias } from '../../modules/medias'
import styles from './preview.css'

export default class Preview extends React.Component {
	render() {
		return <div className={styles.preview}>
			{this.props.media.properties.name}
		</div>
	}
}
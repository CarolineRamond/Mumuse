import React from "react";
import Button from "react-toolbox/lib/button"

import styles from './carousel.css'
export default class MediasUploader extends React.Component {

	render() {
		return <div className={styles.mediasUploaderContainer}>
			<Button primary>Upload medias</Button>
		</div>
	}
}
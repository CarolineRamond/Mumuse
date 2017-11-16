import React from "react";
import ProgressBar from 'react-toolbox/lib/progress_bar';

import { getSelectedMedias } from '../../modules/medias'
import styles from './preview.css'

class ImagePreviewer extends React.Component {
	
	constructor(props) {
		super(props);
		// preload preview & full image
		const previewImg = document.createElement('img');
		const fullImg = document.createElement('img');
		previewImg.src = this.props.media.properties.preview_url;
		fullImg.src = this.props.media.properties.url;

		this.state = {
			loading: true,
			previewImg: previewImg,
			fullImg: fullImg
		}

		this.handleLoadComplete = this.handleLoadComplete.bind(this);
		this.handleLoadError = this.handleLoadError.bind(this);
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.media.properties._id !== this.props.media.properties._id) {
			// media did change => preload previewImg & fullImg
			this.state.previewImg.src = this.props.media.properties.preview_url;
			this.state.fullImg.src = this.props.media.properties.url;
			this.setState({
				loading: true
			});
		}
		if (nextProps.previewMode !== this.props.previewMode) {
			this.setState({
				loading: true
			});
		}
	}

	handleLoadError() {
		this.setState({
			loading: false
		});
	}
	
	handleLoadComplete() {
		this.setState({
			loading: false
		});
	}

	render() {
		const imgUrl = this.props.previewMode ? this.props.media.properties.preview_url : 
			this.props.media.properties.url;

		return <div className={styles.previewImageContainer}>
			{this.state.loading && 
				<div className={styles.previewLoaderContainer}>
					<ProgressBar type="circular" mode="indeterminate" />
				</div>
			}
			<img className={styles.previewImage}
				src={imgUrl}
				onLoad={this.handleLoadComplete}
				onError={this.handleLoadError}/>
		</div>
	}
}

class Previewer extends React.Component {
	render() {
		if (this.props.media.properties.contentType === 'image') {
			return <ImagePreviewer media={this.props.media}
				previewMode={this.props.previewMode}/>
		} else {
			return <div/>
		}
	}
}

export default Previewer;
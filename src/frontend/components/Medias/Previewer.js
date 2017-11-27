import React from "react";
import ProgressBar from "react-toolbox/lib/progress_bar";
import SplitPane from "react-split-pane";

import styles from "./preview.css";
import Potree from "../Potree/Potree";

class ImagePreviewer extends React.Component {
	constructor(props) {
		super(props);
		// preload preview & full image
		const previewImg = document.createElement("img");
		const fullImg = document.createElement("img");
		previewImg.src = this.props.media.properties.preview_url;
		fullImg.src = this.props.media.properties.url;

		this.state = {
			loading: true,
			previewImg: previewImg,
			fullImg: fullImg
		};

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
		const imgUrl = this.props.previewMode
			? this.props.media.properties.preview_url
			: this.props.media.properties.url;

		return (
			<div className={styles.previewImageContainer}>
				{this.state.loading && (
					<div className={styles.previewLoaderContainer}>
						<ProgressBar type="circular" mode="indeterminate" />
					</div>
				)}
				<img
					className={styles.previewImage}
					src={imgUrl}
					onLoad={this.handleLoadComplete}
					onError={this.handleLoadError}
				/>
			</div>
		);
	}
}

class PointCloudPreviewer extends React.Component {
	constructor(props) {
		super(props);
		const pointCloud = this.props.pointCloud;
		this.state = {
			pointCloud: pointCloud
		};
	}

	render() {
		return <Potree className={styles.previewImageContainer} />;
	}
}

class Previewer extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isResizing: false
		};

		this.handleDragStarted = this.handleDragStarted.bind(this);
		this.handleDragFinished = this.handleDragFinished.bind(this);
	}

	handleDragStarted(props) {
		this.setState({
			isResizing: true
		});
	}

	handleDragFinished(props) {
		if (!this.props.mapPreviewMode) {
			// this.props.dispatch(resizeMap());
		}
		this.setState({
			isResizing: false
		});
	}

	render() {
		const resizerStyle = {
			height: "12px",
			width: "100%",
			margin: "auto",
			background: "grey",
			borderLeft: "5px solid #ccc",
			cursor: "ns-resize",
			zIndex: "1"
		};
		const resizerStyleHover = Object.assign({}, resizerStyle, {
			borderLeft: "5px solid blue"
		});
		return (
			<SplitPane
				split="horizontal"
				defaultSize="50%"
				/*minSize={750}*/
				resizerStyle={this.state.isResizing ? resizerStyleHover : resizerStyle}
				onDragStarted={this.handleDragStarted}
				onDragFinished={this.handleDragFinished}
			>
				{this.props.media &&
				this.props.media.properties.contentType === "image" && (
					<ImagePreviewer
						media={this.props.media}
						previewMode={this.props.previewMode}
					/>
				)}
				{this.props.pointCloud && (
					<PointCloudPreviewer
						pointCloud={this.props.pointCloud}
						previewMode={this.props.previewMode}
					/>
				)}
			</SplitPane>
			/*<div>
			{this.props.media.properties.contentType === 'image' && 
				<ImagePreviewer media={this.props.media}
				previewMode={this.props.previewMode}/>
			}
			{this.props.pointCloud &&
				<PointCloudPreviewer pointCloud={this.props.pointCloud}
				previewMode={this.props.previewMode} />
			}
			</div>
			*/
		);
	}
}

export default Previewer;
import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";

import { getSelectedMedias } from "../../modules/medias"
import { selectMediaById } from "../../modules/medias/medias.actions"

class MediasRouter extends React.Component {

	constructor(props) {
		super(props);
		
		// const splitLocation = this.props.location.pathname.split('/');
		// var mediaId;
		// if (splitLocation.length > 3 && splitLocation[2] === "medias" && splitLocation[3]) {
		// 	mediaId = splitLocation[3];
		// 	// this.props.dispatch(selectMediaById(mediaId));
		// }
		// this.state = {
		// 	init: true,
		// 	mediaId: mediaId
		// }
	}

	componentDidMount() {
		const splitLocation = this.props.location.pathname.split('/');
		var mediaId;
		if (splitLocation.length > 3 && splitLocation[2] === "medias" && splitLocation[3]) {
			mediaId = splitLocation[3];
			this.props.dispatch(selectMediaById(mediaId));
		}
		// this.state = {
		// 	init: true,
		// 	mediaId: mediaId
		// }
	}

	componentWillReceiveProps(nextProps) {
		const rootPath = "/" + this.props.location.pathname.split('/')[1];
		const hasSelectedMedia = nextProps.selectedMedias.length === 1

		if (hasSelectedMedia) {
			const mediaId = nextProps.selectedMedias[0].properties._id;
			const didSelectedChange = this.props.selectedMedias.length !== 1 || 
				this.props.selectedMedias[0].properties._id !== mediaId;

			if (didSelectedChange) {
				const newPathName = rootPath + "/medias/" + 
					nextProps.selectedMedias[0].properties._id;
				this.props.history.push(newPathName);
			}
		}
		//  else if (!this.state.init) {
		// 	const hadSelected = this.props.selectedMedias.length === 1;

		// 	if (hadSelected) {
		// 		this.props.history.push(rootPath)
		// 	}
		// }
	}	

	shouldComponentUpdate() {
		// React does not need to re-render this component
		return false;
	}

	render() {
		return <div/>
	}
}

const ConnectedMediasRouter = connect((store)=> {
	return {
		selectedMedias: getSelectedMedias(store.medias)
	}
})(MediasRouter);

export default withRouter(ConnectedMediasRouter);
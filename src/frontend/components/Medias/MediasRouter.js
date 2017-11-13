import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";

import { getSelectedMedias } from "../../modules/medias"

class MediasRouter extends React.Component {

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
		} else {
			const hadSelected = this.props.selectedMedias.length === 1;

			if (hadSelected) {
				this.props.history.push(rootPath)
			}
		}
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
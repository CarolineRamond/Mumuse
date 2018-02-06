import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';

import { selectors } from '../../modules';
const { getSelectedMedias, getSelectedPointCloud } = selectors;
import { actions } from '../../modules';
const { initSelectedMedia } = actions;

class MainRouter extends React.Component {
    componentDidMount() {
        // const splitLocation = this.props.location.pathname.split('/');
        // let mediaId;
        // if (splitLocation.length > 3 && splitLocation[2] === 'medias' && splitLocation[3]) {
        //     mediaId = splitLocation[3];
        //     this.props.dispatch(initSelectedMedia({ mediaId }));
        // }
        // this.state = {
        //     init: mediaId
        // };
    }

    // update route according to new props
    componentWillReceiveProps(nextProps) {
        const didWorldChange =
            nextProps.world.lat !== this.props.world.lat ||
            nextProps.world.lng !== this.props.world.lng ||
            nextProps.world.zoom !== this.props.world.zoom;
        const didPointCloudChange =
            (nextProps.selectedPointCloud && !this.props.selectedPointCloud) ||
            (!nextProps.selectedPointCloud && this.props.selectedPointCloud) ||
            (nextProps.selectedPointCloud &&
                this.props.selectedPointCloud &&
                nextProps.selectedPointCloud.metaData._id !==
                    this.props.selectedPointCloud.metaData._id);
        const didMediaChange =
            (nextProps.selectedMedias[0] && !this.props.selectedMedias[0]) ||
            (!nextProps.selectedMedias[0] && this.props.selectedMedias[0]) ||
            (nextProps.selectedMedias[0] &&
                this.props.selectedMedias[0] &&
                nextProps.selectedMedias[0].properties._id !==
                    this.props.selectedMedias[0].properties._id);

        if (didWorldChange || didPointCloudChange || didMediaChange) {
            // first part of route : /${lat},${lng},${zoom}
            let newRoute =
                '/' + [nextProps.world.lng, nextProps.world.lat, nextProps.world.zoom].join(',');

            // second part of route : /3d/${pointcloudId} (optional)
            if (nextProps.selectedPointCloud) {
                newRoute += `/3d/${nextProps.selectedPointCloud.metaData._id}`;
            }

            // third part of route : /media/${mediaId} (optional)
            if (nextProps.selectedMedias[0]) {
                newRoute += `/media/${nextProps.selectedMedias[0].properties._id}`;
            }

            this.props.history.push(newRoute);
        }

        // const rootPath = '/' + this.props.location.pathname.split('/')[1];
        // const hasSelectedMedia = nextProps.selectedMedias.length === 1;
        // if (this.state.init && hasSelectedMedia) {
        //     this.setState({
        //         init: false
        //     });
        // } else if (hasSelectedMedia) {
        //     const mediaId = nextProps.selectedMedias[0].properties._id;
        //     const didSelectedChange =
        //         this.props.selectedMedias.length !== 1 ||
        //         this.props.selectedMedias[0].properties._id !== mediaId;
        //     if (didSelectedChange) {
        //         const newPathName =
        //             rootPath + '/medias/' + nextProps.selectedMedias[0].properties._id;
        //         this.props.history.push(newPathName);
        //     }
        // } else {
        //     const hadSelected = this.props.selectedMedias.length === 1;
        //     if (hadSelected) {
        //         this.props.history.push(rootPath);
        //     }
        // }
    }

    shouldComponentUpdate() {
        // React does not need to re-render this component
        return false;
    }

    render() {
        return <div />;
    }
}

// Props :
// * dispatch: redux store dispatch function, provided by connect (required)
// * history : current router history, provided by withRouter (required)
// * location : current route location, provided by withRouter
// * match : current route match, provided by withRouter
// * selectedMedias : currently selected medias, provided by connect
MainRouter.propTypes = {
    dispatch: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    location: PropTypes.object,
    match: PropTypes.object.isRequired,
    selectedMedias: PropTypes.arrayOf(PropTypes.object),
    selectedPointCloud: PropTypes.object,
    world: PropTypes.shape({
        lat: PropTypes.number.isRequired,
        lng: PropTypes.number.isRequired,
        zoom: PropTypes.number.isRequired
    })
};

const ConnectedMainRouter = connect(store => {
    return {
        world: store.world,
        selectedPointCloud: getSelectedPointCloud(store),
        selectedMedias: getSelectedMedias(store)
    };
})(MainRouter);

export default withRouter(ConnectedMainRouter);

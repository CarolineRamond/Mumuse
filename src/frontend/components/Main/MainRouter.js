import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';

import { selectors } from '../../modules';
const { getSelectedMedias, getSelectedPointCloud } = selectors;
import { actions } from '../../modules';
const { initSelectedMedia, initSelectedPointCloud } = actions;

class MainRouter extends React.Component {
    // on mount component : check current route
    // to see if some data should be loaded
    componentDidMount() {
        const splitLocation = this.props.location.pathname.split('/');

        // check if a point cloud is required on pageload
        let pointCloudId;
        const pointCloudIndex = splitLocation.findIndex(item => {
            return item === '3d';
        });
        if (pointCloudIndex > -1 && splitLocation.length > pointCloudIndex) {
            pointCloudId = splitLocation[pointCloudIndex + 1];
            this.props.dispatch(initSelectedPointCloud({ pointCloudId }));
        }

        // check if a media is required on pageload
        let mediaId;
        const mediaIndex = splitLocation.findIndex(item => {
            return item === 'media';
        });
        if (mediaIndex > -1 && splitLocation.length > mediaIndex) {
            mediaId = splitLocation[mediaIndex + 1];
            // this.props.dispatch(initSelectedMedia({ mediaId }));
            // a media was required on pageload
            // => if a pointcloud was also required, load pointcloud before loading media (cf componentWillRecevieProps)
            // => else, load media using initSelectedMedia action
            if (!pointCloudId) {
                this.props.dispatch(initSelectedMedia({ mediaId }));
            }
        }

        this.state = {
            initialMediaId: mediaId,
            initialPointcloudId: pointCloudId
        };
    }

    // update route according to new props
    componentWillReceiveProps(nextProps) {
        const isInitFinished = !this.state.initialMediaId && !this.state.initialPointcloudId;
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

        // initial point cloud was loaded => set initialPointcloudId to null
        // if a media was also required on pageload, load the media
        if (
            this.state.initialPointcloudId &&
            nextProps.selectedPointCloud &&
            nextProps.selectedPointCloud.metaData._id === this.state.initialPointcloudId
        ) {
            this.setState(
                {
                    initialPointcloudId: null
                },
                () => {
                    if (this.state.initialMediaId) {
                        this.props.dispatch(
                            initSelectedMedia({ mediaId: this.state.initialMediaId })
                        );
                    }
                }
            );
        }

        // initial media was loaded => set initialMediaId to null
        if (
            this.state.initialMediaId &&
            nextProps.selectedMedias[0] &&
            nextProps.selectedMedias[0].properties._id === this.state.initialMediaId
        ) {
            this.setState({
                initialMediaId: null
            });
        }

        // a property changed => update route
        if (isInitFinished && (didWorldChange || didPointCloudChange || didMediaChange)) {
            // first part of route : /${lat},${lng},${zoom}
            let newRoute =
                '/' + [nextProps.world.lng, nextProps.world.lat, nextProps.world.zoom].join(',');

            // second part of route : /3d/${pointCloudId} (optional)
            if (nextProps.selectedPointCloud) {
                newRoute += `/3d/${nextProps.selectedPointCloud.metaData._id}`;
            }

            // third part of route : /media/${mediaId} (optional)
            if (nextProps.selectedMedias[0]) {
                newRoute += `/media/${nextProps.selectedMedias[0].properties._id}`;
            }

            this.props.history.push(newRoute);
        }
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

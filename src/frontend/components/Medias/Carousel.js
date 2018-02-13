import React from 'react';
import { connect } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroller';
import LazyLoad from 'react-lazy-load';
import PropTypes from 'prop-types';

import { selectors } from '../../modules';
const {
    isAuthUserAdmin,
    getVisibleMedias,
    getSelectFilterPending,
    areMediasLocked,
    getSelectedMedias
} = selectors;
import { actions } from '../../modules';
const { clickMedias, clickPointCloud } = actions;

import styles from './carousel.css';

class Carousel extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            mediasSlice: [],
            hasMore: true
        };
        this.mediaDomElements = {};
        this.loadThumbnailsUntilFirstSelectedMediaVisible = this.loadThumbnailsUntilFirstSelectedMediaAvailable.bind(
            this
        );
        this.loadMoreThumbnails = this.loadMoreThumbnails.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleLoadError = this.handleLoadError.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (!nextProps.selectFilterPending && this.props.selectFilterPending) {
            const newMediasSlice = nextProps.medias.slice(0, this.state.mediasSlice.length);
            this.setState({
                mediasSlice: newMediasSlice
            });
        } else if (nextProps.medias.length !== this.props.medias.length) {
            this.setState({
                mediasSlice: [],
                hasMore: nextProps.medias.length > 0
            });
        }

        if (
            nextProps.firstSelectedMedia &&
            (!this.props.firstSelectedMedia ||
                nextProps.firstSelectedMedia.properties._id !==
                    this.props.firstSelectedMedia.properties._id)
        ) {
            this.loadThumbnailsUntilFirstSelectedMediaAvailable(
                nextProps.firstSelectedMedia.properties._id
            );
        }
    }

    loadThumbnailsUntilFirstSelectedMediaAvailable(mediaId) {
        const isSelectedMediaAvailable = this.state.mediasSlice.find(
            media => media.properties._id === mediaId
        );
        if (!isSelectedMediaAvailable) {
            this.loadMoreThumbnails(() => {
                this.loadThumbnailsUntilFirstSelectedMediaAvailable(mediaId);
            });
        } else {
            this.scrollToMedia(mediaId);
        }
    }

    loadMoreThumbnails(callback) {
        const n = this.state.mediasSlice.length;
        if (this.state.hasMore) {
            const newSlice = this.props.medias.slice(n, n + 10);
            this.setState(
                {
                    mediasSlice: this.state.mediasSlice.concat(newSlice),
                    hasMore: this.props.medias.length > n + 10
                },
                () => {
                    typeof callback === 'function' && callback();
                }
            );
        }
    }

    scrollToMedia(mediaId) {
        this.mediaDomElements[mediaId] &&
            this.mediaDomElements[mediaId].scrollIntoView({ behavior: 'smooth' });
    }

    handleClick(target, ctrlKey) {
        const isOutside = target.tagName !== 'IMG';
        if (isOutside) {
            const features = [];
            this.props.dispatch(clickMedias({ features, ctrlKey }));
        }
    }

    selectMedia(media, ctrlKey) {
        const features = [media];
        // fake pointcloud click (to select potential pointcloud associated to media)
        this.props.dispatch(
            clickPointCloud({
                features: features,
                ctrlKey: ctrlKey,
                isAdmin: this.props.isAdmin
            })
        );
        // media click (/!\ should be called in this order)
        this.props.dispatch(
            clickMedias({
                features: features,
                ctrlKey: ctrlKey,
                isAdmin: this.props.isAdmin
            })
        );
    }

    handleLoadError(e, media) {
        // Use full media picture if preview is no available
        if (e.target.src === media.properties.thumbnail_url) {
            e.target.src = media.properties.url;
        }
        this.setState({
            loading: false
        });
    }

    handleLoadComplete(e) {
        e.target.style.display = 'block';
        this.setState({
            loading: false
        });
    }

    render() {
        const mappedThumbnails = [];
        this.state.mediasSlice.map((media, i) => {
            const classes = [styles.thumbnail, styles.thumbnailLoading];
            if (media.properties.selected) {
                classes.push(styles.thumbnailSelected);
            }
            mappedThumbnails.push(
                <div
                    className={styles.thumbnailContainer}
                    key={i}
                    // ref={media.properties._id}
                    ref={el => {
                        this.mediaDomElements[media.properties._id] = el;
                    }}
                    onClick={e => {
                        this.selectMedia(media, e.ctrlKey);
                    }}
                >
                    <LazyLoad className={styles.thumbnail}>
                        <img
                            className={classes.join(' ')}
                            src={media.properties.thumbnail_url}
                            onLoad={e => this.handleLoadComplete(e)}
                            onError={e => this.handleLoadError(e, media)}
                        />
                    </LazyLoad>
                </div>
            );
        });

        if (this.props.areMediasLocked) {
            return (
                <div className={styles.mediasLockedMessage}>
                    <div>Please zoom in to view individual media.</div>
                </div>
            );
        } else {
            return (
                <div
                    className={styles.infiniteScrollContainer}
                    onClick={e => {
                        this.handleClick(e.target, e.ctrlKey);
                    }}
                >
                    <InfiniteScroll
                        className={styles.infiniteScroll}
                        pageStart={0}
                        loadMore={this.loadMoreThumbnails}
                        hasMore={this.state.hasMore}
                        useWindow={false}
                        loader={<div className="loader">Loading ...</div>}
                    >
                        {mappedThumbnails}
                    </InfiniteScroll>
                </div>
            );
        }
    }
}

Carousel.propTypes = {
    /** whether medias layer is locked (user should zoom more), provided by connect */
    areMediasLocked: PropTypes.bool.isRequired,

    /** redux store dispatch function, provided by connect */
    dispatch: PropTypes.func.isRequired,

    /** first selected media feature */
    firstSelectedMedia: PropTypes.object,

    /** whether currently authenticated user has admin rights, provided by connect */
    isAdmin: PropTypes.bool,

    /** array of visible media features, provided by connect */
    medias: PropTypes.arrayOf(PropTypes.object).isRequired,

    /** whether a filter is being applied on medias layers (if so, carousel thumbnails should not reload) */
    selectFilterPending: PropTypes.bool.isRequired
};

// Store connection
const ConnectedCarousel = connect(store => {
    const selectedMedias = getSelectedMedias(store);
    return {
        medias: getVisibleMedias(store),
        firstSelectedMedia: selectedMedias[0],
        selectFilterPending: getSelectFilterPending(store),
        areMediasLocked: areMediasLocked(store),
        isAdmin: isAuthUserAdmin(store)
    };
})(Carousel);

export default ConnectedCarousel;

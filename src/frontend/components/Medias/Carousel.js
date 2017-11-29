import React from 'react';
import { connect } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroller';
import PropTypes from 'prop-types';

import { selectors } from '../../modules';
const { isAuthUserAdmin, getVisibleMedias, getSelectFilterPending, areMediasLocked } = selectors;
import { actions } from '../../modules';
const { clickMedias } = actions;

import styles from './carousel.css';

class Carousel extends React.Component {
	constructor (props) {
        super(props);

        this.state = {
            mediasSlice: [],
            hasMore: true
        };
        this.loadMoreThumbnails = this.loadMoreThumbnails.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    componentWillReceiveProps (nextProps) {
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
    }

    loadMoreThumbnails () {
        const n = this.state.mediasSlice.length;
        if (this.state.hasMore) {
            const newSlice = this.props.medias.slice(n, n + 10);
            this.setState({
                mediasSlice: this.state.mediasSlice.concat(newSlice),
                hasMore: this.props.medias.length > n + 10
            });
        }
    }

    handleClick (target, ctrlKey) {
        const isOutside = target.tagName !== 'IMG';
        if (isOutside) {
            const features = [];
            this.props.dispatch(clickMedias({ features, ctrlKey }));
        }
    }

    selectMedia (media, ctrlKey) {
        const features = [media];
        this.props.dispatch(clickMedias({
            features: features,
            ctrlKey: ctrlKey,
            isAdmin: this.props.isAdmin
        }));
    }

	render () {
		const mappedThumbnails = [];
        this.state.mediasSlice.map((media, i) => {
            const classes = [styles.thumbnail];
            if (media.properties.selected) {
                classes.push(styles.thumbnailSelected);
            }
            mappedThumbnails.push(
                <div className={styles.thumbnailContainer} key={i}
                    onClick={(e)=>{this.selectMedia(media, e.ctrlKey);}}>
                    <img className={classes.join(' ')}
                        src={media.properties.thumbnail_url}
                    />
                </div>
            );
        });

		if (this.props.areMediasLocked) {
            return <div className={styles.mediasLockedMessage}>
                <div>Please zoom in to view individual media.</div>
            </div>;
        } else {
            return <div className={styles.infiniteScrollContainer}
                onClick={(e)=>{this.handleClick(e.target, e.ctrlKey);}}>
                <InfiniteScroll className={styles.infiniteScroll}
                    pageStart={0}
                    loadMore={this.loadMoreThumbnails}
                    hasMore={this.state.hasMore}
                    useWindow={false}
                    loader={<div className='loader'>Loading ...</div>}>
                  {mappedThumbnails}
                </InfiniteScroll>
            </div>;
        }
	}
}

// Props :
// * areMediasLocked: whether medias layer is locked (user should zoom more)
//   provided by connect (required)
// * dispatch: redux store dispatch function, provided by connect (required)
// * isAdmin : whether currently authenticated user has admin rights, provided by connect
// * medias: array of visible media features, provided by connect (required)
// * selectFilterPending : whether a filter is being applied on medias layers
//   (if so, carousel thumbnails should not reload)
Carousel.propTypes = {
    areMediasLocked: PropTypes.bool.isRequired,
    dispatch: PropTypes.func.isRequired,
    isAdmin: PropTypes.bool,
    medias: PropTypes.arrayOf(PropTypes.object).isRequired,
    selectFilterPending: PropTypes.bool.isRequired
};

// Store connection
const ConnectedCarousel = connect((store)=> {
    return {
        medias: getVisibleMedias(store),
        selectFilterPending: getSelectFilterPending(store),
        areMediasLocked: areMediasLocked(store),
        isAdmin: isAuthUserAdmin(store)
    };
})(Carousel);

export default ConnectedCarousel;

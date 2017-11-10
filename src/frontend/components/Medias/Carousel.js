import React from "react";
import { connect } from "react-redux"
import InfiniteScroll from 'react-infinite-scroller'
import PropTypes from "prop-types"

import { clickMedias } from '../../modules/medias/medias.actions'
import { getVisibleMedias, getSelectFilterPending, areMediasLocked } from '../../modules/medias'
import styles from "./carousel.css"


class Carousel extends React.Component {
	constructor(props) {
        super(props);

        this.state = {
            mediasSlice: [],
            hasMore: true
        };
        this.loadMoreThumbnails = this.loadMoreThumbnails.bind(this);
        this.handleClick = this.handleClick.bind(this);
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
    }

    loadMoreThumbnails() {
    	const n = this.state.mediasSlice.length;
    	if (this.state.hasMore) {
    		const newSlice = this.props.medias.slice(n, n + 10);
			this.setState({
    			mediasSlice: this.state.mediasSlice.concat(newSlice),
    			hasMore: this.props.medias.length > n + 10
    		});
    	}
    }

    handleClick(target, ctrlKey) {
        const isOutside = target.tagName !== "IMG";
        if (isOutside) {
            const features = [];
            this.props.dispatch(clickMedias({ features, ctrlKey }));
        }
    }

    selectMedia(media, ctrlKey) {
        const features = [media];
    	this.props.dispatch(clickMedias({ features, ctrlKey }));
    }

	render() {
        // console.log("RENDER CAROUSEL ");
        // const toto = this.state.mediasSlice.map((media)=> {
        //     return { name: media.properties.name, selected: media.properties.selected };
        // })
        // console.log("carousel ", toto);

		var mappedThumbnails = [];
        this.state.mediasSlice.map((media, i) => {
            var classes = [styles.thumbnail];
            if (media.properties.selected) {
                classes.push(styles.thumbnailSelected);
            }
            mappedThumbnails.push(
            	<div className={styles.thumbnailContainer} key={i}
            		onClick={(e)=>{this.selectMedia(media, e.ctrlKey)}}>
                	<img className={classes.join(' ')}
                    src={media.properties.thumbnail_url}/>
            	</div>
            );
        });

		if (this.props.areMediasLocked) {
            return <div className={styles.mediasLockedMessage}>
                <div>Please zoom in to view individual media.</div>
            </div>
        } else {
            return <div className={styles.infiniteScrollContainer}
                onClick={(e)=>{this.handleClick(e.target, e.ctrlKey)}}>
                <InfiniteScroll className={styles.infiniteScroll}
                    pageStart={0}
                    loadMore={this.loadMoreThumbnails}
                    hasMore={this.state.hasMore}
                    useWindow={false}
                    loader={<div className="loader">Loading ...</div>}>
                  {mappedThumbnails}
                </InfiniteScroll>
            </div>
        }
	}
}

// Props :
// * medias: array of visible media features, provided by @connect (required),
// * shouldCarouselUpdate: whether carousel should be entirely reloaded 
// (in case of viewport change) ; provided by @connect (required)
// * areMediasLocked: whether medias layer is locked (use should zoom more),
// provided by @connect (required)
Carousel.propTypes = {
    medias: PropTypes.arrayOf(PropTypes.object).isRequired,
    selectFilterPending: PropTypes.bool.isRequired,
    areMediasLocked: PropTypes.bool.isRequired
}

// Store connection
const ConnectedCarousel = connect((store)=> {
    return  {
        medias: getVisibleMedias(store.medias),
        selectFilterPending: getSelectFilterPending(store.medias),
        areMediasLocked: areMediasLocked(store.medias)
    }
})(Carousel);

export default ConnectedCarousel;
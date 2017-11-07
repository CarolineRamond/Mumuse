import React from "react";
import { connect } from "react-redux"
import InfiniteScroll from 'react-infinite-scroller'
import PropTypes from "prop-types"

import { selectCarouselMedias, deselectCarouselMedias } from '../../modules/medias/medias.actions'
import { getVisibleMedias, getSelectedMedias, getDidMediasNbChange,
    areMediasLocked } from '../../modules/medias'
import styles from "./carousel.css"


class Carousel extends React.Component {
	constructor(props) {
        super(props);

        this.state = {
            mediasSlice: [],
            hasMore: true
        };
        this.loadMoreThumbnails = this.loadMoreThumbnails.bind(this);
    }

    componentWillReceiveProps(nextProps) {
    	if (nextProps.shouldCarouselUpdate) {
    		// visible medias changed : reload thumbnails
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

    selectMedia(media, ctrlKey) {
    	this.props.dispatch(deselectCarouselMedias(ctrlKey));
    	this.props.dispatch(selectCarouselMedias([media], ctrlKey));
    }

	render() {
		var mappedThumbnails = [];
        this.state.mediasSlice.map((media, i) => {
            mappedThumbnails.push(
            	<div className={styles.thumbnail} key={i}
            		onClick={(e)=>{this.selectMedia(media, e.ctrlKey)}}>
                	<img className={styles.thumbnail}
                    src={media.properties.thumbnail_url}/>
            		<div style={{position:"absolute", color: "white", top: "20%", left: "50%"}}>{i}</div>
            	</div>
            );
        });

		if (this.props.areMediasLocked) {
            return <div className={styles.mediasLockedMessage}>
                <div>Please zoom in to view individual media.</div>
            </div>
        } else {
            return <div className={styles.infiniteScrollContainer}>
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
    shouldCarouselUpdate: PropTypes.bool.isRequired,
    areMediasLocked: PropTypes.bool.isRequired
}

// Store connection
const ConnectedCarousel = connect((store)=> {
    return  {
        medias: getVisibleMedias(store.medias),
        shouldCarouselUpdate: getDidMediasNbChange(store.medias),
        areMediasLocked: areMediasLocked(store.medias)
    }
})(Carousel);

export default ConnectedCarousel;
import React from "react";
import { connect } from "react-redux"
import InfiniteScroll from 'react-infinite-scroller'

import styles from '../css/pannel.css'
import { selectCarouselMedias, deselectCarouselMedias } from '../modules/medias/medias.actions'
import { getVisibleMedias, getSelectedMedias, getDidMediasNbChange } from '../modules/medias'

// this is to set up component's props
// component's props will be an excerpt
// of the store
// + some functions like dispatch (to fire actions)
@connect((store)=> {
	return  {
		medias: getVisibleMedias(store.medias),
		selectedMedias: getSelectedMedias(store.medias),
		shouldCarouselUpdate: getDidMediasNbChange(store.medias)
	}
})

export default class Carousel extends React.Component {
	constructor(props) {
        super(props);

        this.state = {
            mediasSlice: [],
            hasMore: true
        };
        this.loadThumbnails = this.loadThumbnails.bind(this);
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

    loadThumbnails() {
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
                    src="http://wskg.org/wp-content/uploads/2017/06/BIP20150609A01_BP-0564.jpg"/>
            		<div style={{position:"absolute", color: "white", top: "20%", left: "50%"}}>{i}</div>
            	</div>
            );
        });

		return <div>
			<h3>Medias</h3>
			<div className={styles.infiniteScrollContainer}>
				<InfiniteScroll className={styles.infiniteScroll}
				    pageStart={0}
				    loadMore={this.loadThumbnails}
				    hasMore={this.state.hasMore}
				    useWindow={false}
				    loader={<div className="loader">Loading ...</div>}>
				  {mappedThumbnails}
				</InfiniteScroll>
			</div>
		</div>
	}
}
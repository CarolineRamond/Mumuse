import React from "react";
import { connect } from "react-redux"
import _ from "lodash"
import { IconButton } from "react-toolbox/lib/button"
import InfiniteScroll from 'react-infinite-scroller'

import styles from '../css/pannel.css'
import { toggleLayerMedias, selectCarouselMedias } from '../modules/medias/medias.actions'
import { getVisibleMedias, getSelectedMedias, getViewportMediaCount, 
	getFilters, getDidMediasNbChange } from '../modules/medias'

// this is to set up component's props
// component's props will be an excerpt
// of the store
// + some functions like dispatch (to fire actions)
@connect((store)=> {
	return  {
		world: store.world,
		medias: getVisibleMedias(store.medias),
		selectedMedias: getSelectedMedias(store.medias),
		viewportMediaCount: getViewportMediaCount(store.medias),
		shouldCarouselUpdate: getDidMediasNbChange(store.medias),
		layers: store.medias.layers
	}
})

export default class Pannel extends React.Component {
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
    		console.log('RELOAD THUMBNAILS');
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
    	this.props.dispatch(selectCarouselMedias([media], ctrlKey));
    }

	toggleLayer(layerId) {
		this.props.dispatch(toggleLayerMedias(layerId));
	}

	render() {
		const mappedLayers = [];
		_.forIn(this.props.layers, (layer, layerId)=> {
			var icon = "visibility_off";
			if (layer.metadata.isLocked) {
				icon = "lock";
			} else if (layer.metadata.isShown) {
				icon = "visibility";
			}
			mappedLayers.push(<div key={layerId} className={styles.layer}>
				<IconButton disabled={layer.metadata.isLocked}
					onClick={()=> {this.toggleLayer(layerId)}} icon={icon}/>
				{layer.metadata.name}
			</div>);
		});

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

		return <div className={styles.pannel}>
			<strong>Layers</strong>
			<div>
				{mappedLayers}
			</div>
			<hr/>
			<strong>Medias</strong>
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
import React from "react";
import { connect } from "react-redux"
import _ from "lodash"
import { IconButton } from "react-toolbox/lib/button"
import InfiniteScroll from 'react-infinite-scroller'

import styles from '../css/pannel.css'
import { toggleLayerMedias } from '../modules/medias/medias.actions'
import { getVisibleMedias, getSelectedMedias, getViewportMediaCount, getFilters } from '../modules/medias'

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
		layers: store.medias.layers
	}
})

export default class Pannel extends React.Component {
	constructor(props) {
        super(props);

        this.state = {
            thumbnails: [],
            hasMore: true
        };
        this.loadThumbnails = this.loadThumbnails.bind(this);
    }

    componentWillReceiveProps(nextProps) {
    	this.setState({
    		thumbnails: [],
    		hasMore: nextProps.medias.length > 0
    	});
    }

    loadThumbnails() {
    	console.log("LOAD THUMBNAILS");
    	console.log(this.state);
    	const n = this.state.thumbnails.length;
    	if (this.state.hasMore) {
    		console.log('coucou')
    		console.log(this.props.medias);
    		const newSlice = this.props.medias.slice(n, n+10);
    		console.log(newSlice);
    		this.setState({
    			thumbnails: this.state.thumbnails.concat(newSlice),
    			hasMore: this.props.medias.length > n + 10
    		});
    	}
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
        this.state.thumbnails.map((thumbnail, i) => {
            mappedThumbnails.push(
                <img className={styles.thumbnail} key={i}
                    src="http://wskg.org/wp-content/uploads/2017/06/BIP20150609A01_BP-0564.jpg"/>
            );
        });

		return <div className={styles.pannel}>
			<strong>Layers</strong>
			<div>
				{mappedLayers}
			</div>
			<hr/>
			<strong>Medias</strong>
			<InfiniteScroll className={styles.infiniteScroll}
			    pageStart={0}
			    loadMore={this.loadThumbnails}
			    hasMore={this.state.hasMore}
			    loader={<div className="loader">Loading ...</div>}>
			  {mappedThumbnails}
			</InfiniteScroll>
		</div>
	}
}
import React from "react";
import { connect } from "react-redux";
import {Tab, Tabs} from 'react-toolbox';

import Layers from "../Map/Layers"
import Carousel from "../Medias/Carousel"
import MediasUploader from "../Medias/MediasUploader"
import styles from './pannel.css'

class SidePanel extends React.Component {
	constructor(props) {
        super(props);
        this.state = {
            index: 0,
        };
        this.handleTabChange = this.handleTabChange.bind(this);
    }

    handleTabChange(index) {
    	this.setState({index});
    }

	render() {
		return <div className={styles.pannel}>
			<Tabs className={styles.pannelTabs}
				theme={{navigationContainer:styles.pannelNavigationContainer, tab: styles.pannelTab}}
				index={this.state.index} 
				onChange={this.handleTabChange}>
	          	<Tab label='Medias'>
          			<Carousel/>
          			{this.props.user && this.props.user.roles.indexOf('admin') > -1 &&
          				<MediasUploader/>}
	          	</Tab>
	          	<Tab label='Layers'>
          			<Layers/>
	          	</Tab>
	        </Tabs>
	    </div>
	}
}

const ConnectedSidePanel = connect((store)=> {
	return {
		user: store.auth.user
	}
})(SidePanel);

export default ConnectedSidePanel;
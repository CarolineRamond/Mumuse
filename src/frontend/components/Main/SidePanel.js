import React from "react";
import { connect } from "react-redux";
import {Tab, Tabs} from 'react-toolbox';
import PropTypes from "prop-types"

import { selectors } from "../../modules"
const { isAuthUserAdmin } = selectors;

import Layers from "../Map/Layers"
import Carousel from "../Medias/Carousel"
import MediasActions from "../Medias/MediasActions"
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
          			{this.props.isAdmin && 
          				<MediasActions/>
          			}
	          	</Tab>
	          	<Tab label='Layers'>
          			<Layers/>
	          	</Tab>
	        </Tabs>
	    </div>
	}
}

// Props :
// * isAdmin: whether authenticated user has admin rights, provided by connect
SidePanel.propTypes = {
    isAdmin: PropTypes.bool,
}

const ConnectedSidePanel = connect((store)=> {
	return {
		isAdmin: isAuthUserAdmin(store)
	}
})(SidePanel);

export default ConnectedSidePanel;
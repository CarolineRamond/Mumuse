import React from "react";
import {Tab, Tabs} from 'react-toolbox';

import Layers from "../Map/Layers"
import Carousel from "../Medias/Carousel"
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
	          	</Tab>
	          	<Tab label='Layers'>
          			<Layers/>
	          	</Tab>
	        </Tabs>
	    </div>
	}
}

export default SidePanel;
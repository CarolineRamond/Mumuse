import React from "react";
import {Tab, Tabs} from 'react-toolbox';

import Layers from "../Map/Layers"
import Carousel from "../Medias/Carousel"
import styles from './pannel.css'

export default class SidePannel extends React.Component {
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
				theme={{navigationContainer:styles.pannelNavigationContainer}}
				index={this.state.index} 
				onChange={this.handleTabChange}>
	          	<Tab label='Medias'>
	          		<div className={styles.pannelTab}>
	          			<Carousel/>
	          		</div>
	          	</Tab>
	          	<Tab label='Layers'>
	          		<div className={styles.pannelTab}>
	          			<Layers/>
	          		</div>
	          	</Tab>
	        </Tabs>
	    </div>
	}
}
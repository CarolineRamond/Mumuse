import React from "react";
import { connect } from "react-redux"
import { Link } from "react-router-dom"
import Button from "react-toolbox/lib/button"

import Map from './Map'
import Pannel from './Pannel'
import Preview from './Preview'
import Timeline from './Timeline'
import { mapConfig } from '../modules'
import styles from '../css/layout.css'

const Layout = ()=>(
	<div>
		<Map config={mapConfig}></Map>
		<Pannel></Pannel>
		<Timeline></Timeline>
		<Preview></Preview>
		<Link to="/auth/login">
			<Button icon='account_box' floating className={styles.authButton}/>
		</Link>
	</div>
)

export default Layout;
import React from "react";
import { HashRouter as Router, Route, Switch, Link } from 'react-router-dom'

import Layout from './Layout'
import Auth from './Auth'
import styles from '../css/auth'

export default class App extends React.Component {
	render() {
		return <Router>
			<div>
				<Layout/>
				<Switch>
					<CSSTransitionGroup
			            transitionName={{
			            	enter: styles.enter,
    						enterActive: styles.enterActive,
			            }}
			            transitionEnterTimeout={250}
			            transitionLeaveTimeout={250}>
						<Route path="/auth" component={Auth}/>
					</CSSTransitionGroup>
				</Switch>
	     	</div>
	    </Router>
	}
}


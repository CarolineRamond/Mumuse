import React from "react";
import { HashRouter as Router, Route, Switch, Link } from 'react-router-dom'

import Layout from './Layout'
import Auth from './Auth'

export default class App extends React.Component {
	render() {
		return <Router>
			<div>
				<Layout/>
				<Switch>
					<Route path="/auth" component={Auth}/>
				</Switch>
	     	</div>
	    </Router>
	}
}


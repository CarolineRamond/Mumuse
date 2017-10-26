import React from "react";
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import Layout from './Layout'
import Login from './Login'
import Register from './Register'

export default class App extends React.Component {
	render() {
		return <Router>
			<div>
				<Layout/>
				<Switch>
			      <Route path="/register" component={Register}/>
			      <Route path="/login" component={Login}/>
		     	</Switch>
	     	</div>
	    </Router>
	}
}
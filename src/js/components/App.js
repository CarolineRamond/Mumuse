import React from "react";
import { BrowserRouter as Router, Route } from 'react-router-dom'

import Layout from './Layout'
import Login from './Login'
import Register from './Register'

export default class App extends React.Component {
	render() {
		return <Router>
			<div>
		      <Route exact={true} path="/" component={Layout}/>
		      <Route path="/register" component={Register}/>
		      <Route path="/login" component={Login}/>
	     	</div>
	    </Router>
	}
}
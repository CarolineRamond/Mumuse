import React from "react";
import { BrowserRouter as Router, Route } from 'react-router-dom'

import Layout from './Layout'

export default class App extends React.Component {
	render() {
		return <Router>
	      <Route path="/" component={Layout}/>
	    </Router>
	}
}
import React from "react";
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom'

import Login from './Login'
import Register from './Register'
import Dialog, { DialogTitle } from 'material-ui/Dialog';

export default class Auth extends React.Component {
	render() {
		return <Dialog open={true} classes={{paper: "auth-dialog"}}>
			<Router>
				<Switch>
			      <Route path="/auth/register" component={Register}/>
			      <Route path="/auth/login" component={Login}/>
		     	</Switch>
		    </Router>
	    </Dialog>
	}
}
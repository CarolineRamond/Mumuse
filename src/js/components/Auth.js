import React from "react";
import { Switch, Route, Redirect } from 'react-router-dom'

import Login from './Login'
import Register from './Register'
import '../../css/auth.css'

const Auth = ({ match })=> (
	<div className="auth-dialog">
		<Switch>
			<Route exact path={`${match.url}/register`} component={Register}/>
			<Route exact path={`${match.url}/login`} component={Login}/>
			<Redirect to={`${match.url}/login`}/>
		</Switch>
    </div>
)

export default Auth;
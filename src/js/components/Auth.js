import React from "react";
import { Switch, Route, Redirect } from 'react-router-dom'

import Login from './Auth/Login'
import Register from './Auth/Register'
import ForgotPassword from './Auth/ForgotPassword'
import '../../css/auth.css'

const Auth = ({ match })=> (
	<div className="auth-background">
		<div className="auth-pannel-container">
			<Switch>
				<Route exact path={`${match.url}/register`} component={Register}/>
				<Route exact path={`${match.url}/login`} component={Login}/>
				<Route exact path={`${match.url}/forgot`} component={ForgotPassword}/>
				<Redirect to={`${match.url}/login`}/>
			</Switch>
	    </div>
    </div>
)

export default Auth;
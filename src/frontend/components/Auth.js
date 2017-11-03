import React from "react";
import { Switch, Route, Redirect } from 'react-router-dom'

import Login from './Auth/Login'
import Register from './Auth/Register'
import ForgotPassword from './Auth/ForgotPassword'
import { authBackground, authPannelContainer } from '../css/auth.css'

const Auth = ({ location, match })=> {
	return <div className={authBackground}>
		<div className={authPannelContainer}>
			<Switch>
				<Route path="/:loc/auth/login" component={Login}/>
				<Route path="/:loc/auth/register" component={Register}/>
				<Route path="/:loc/auth/forgot" component={ForgotPassword}/>
			</Switch>
	    </div>
    </div>
}

export default Auth;


			
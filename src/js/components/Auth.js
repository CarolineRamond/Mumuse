import React from "react";
import { Route, Redirect } from 'react-router-dom'

import Login from './Login'
import Register from './Register'
import '../../css/auth.css'

const Auth = ({ match })=> (
	<div className="auth-dialog">
		<Route exact path={`${match.url}/register`} component={Register}/>
		<Route path={`${match.url}/login`} component={Login}/>
		<Redirect to={`${match.url}/login`}/>
    </div>
)

export default Auth;
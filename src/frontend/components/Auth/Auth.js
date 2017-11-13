import React from "react";
import { Switch, Route, Redirect } from 'react-router-dom'
import { withRouter } from "react-router"
import { CSSTransitionGroup } from 'react-transition-group'
import PropTypes from "prop-types"

import Login from './Login'
import Register from './Register'
import ForgotPassword from './ForgotPassword'
import ResetPassword from './ResetPassword'
import styles from '../Common/form.css'
import Dialog from "react-toolbox/lib/dialog"

class Auth extends React.Component {
    render() {
        return <Switch>
			<Route path="/:loc/auth/login" component={Login}/>
			<Route path="/:loc/auth/register" component={Register}/>
			<Route path="/:loc/auth/forgot" component={ForgotPassword}/>
            <Route path="/:loc/auth/reset" component={ResetPassword}/>
		</Switch>
    }
}

// Props :
// * location : current route location, provided by function withRouter (required)
// * match : current route match, provided by function withRouter
// * history : current router history, provided by function withRouter
Auth.propTypes = {
    location: PropTypes.object.isRequired, 
    match: PropTypes.object, 
    history: PropTypes.object 
}

export default withRouter(Auth);

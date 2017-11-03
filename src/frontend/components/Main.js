import React from "react";
import { Route, Switch } from 'react-router-dom'
import { CSSTransitionGroup } from 'react-transition-group'

import MainLayout from "./MainLayout"
import Auth from "./Auth"
import styles from "../css/test.css"

const AuthRoute = ({location})=> (
    <CSSTransitionGroup
    	component="div"
        transitionName={{
			enter: styles.enter,
		    enterActive: styles.enterActive,
		    leave: styles.leave,
		    leaveActive: styles.leaveActive,
        }}
        transitionEnterTimeout={300}
        transitionLeaveTimeout={300}>
        <Switch key={location.pathname} location={location}>
        	<Route path="/:loc/auth" component={Auth}/>
       	</Switch>
    </CSSTransitionGroup>
)

const Main = ({history, location}) => (
	<div>
        <MainLayout location={location} history={history}/>
        <AuthRoute location={location}/>
    </div>
)

export default Main;
import React from "react";
import { Route, Switch } from 'react-router-dom'
import { CSSTransitionGroup } from 'react-transition-group'

import Layout from "./Layout"
import Auth from "../Auth"
import { authEnter, authEnterActive, authLeave, authLeaveActive } from "../Auth/auth.css"

const AuthRoute = ({location})=> (
    <CSSTransitionGroup
    	component="div"
        transitionName={{
			enter: authEnter,
		    enterActive: authEnterActive,
		    leave: authLeave,
		    leaveActive: authLeaveActive,
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
        <Layout location={location} history={history}/>
        <AuthRoute location={location}/>	
    </div>
)

export default Main;
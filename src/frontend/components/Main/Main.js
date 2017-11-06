import React from "react";
import { Route, Switch } from 'react-router-dom'
import { withRouter } from "react-router"
import { CSSTransitionGroup } from 'react-transition-group'

import Layout from "./Layout"
import Auth from "../Auth"
import { authEnter, authEnterActive, authLeave, authLeaveActive } from "../Auth/auth.css"

class AuthRoute extends React.Component {
    render() {
        return <CSSTransitionGroup
        	component="div"
            transitionName={{
    			enter: authEnter,
    		    enterActive: authEnterActive,
    		    leave: authLeave,
    		    leaveActive: authLeaveActive,
            }}
            transitionEnterTimeout={300}
            transitionLeaveTimeout={300}>
            <Switch key={this.props.location.pathname} location={this.props.location}>
            	<Route path="/:loc/auth" component={Auth}/>
           	</Switch>
        </CSSTransitionGroup>
    }
}

const AuthRouteWithRouter = withRouter(AuthRoute);


const Main = () => (
    <div>
        <Layout/>
        <AuthRouteWithRouter/>	
    </div>
)

export default Main;
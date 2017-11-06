import React from "react";
import { Switch, Route, Redirect } from 'react-router-dom'
import { withRouter } from "react-router"
import { CSSTransitionGroup } from 'react-transition-group'

import Login from './Login'
import Register from './Register'
import ForgotPassword from './ForgotPassword'
import styles from './auth.css'

class Auth extends React.Component {
    render() {
        return <CSSTransitionGroup
        	component="div"
            transitionName={{
    			enter: styles.authEnter,
    		    enterActive: styles.authEnterActive,
    		    leave: styles.authLeave,
    		    leaveActive: styles.authLeaveActive,
            }}
            transitionEnterTimeout={300}
            transitionLeaveTimeout={300}>
            <Switch key={this.props.location.pathname} location={this.props.location}>
            	<Route path="/:loc/auth" component={()=>(
            		<div className={styles.authBackground}>
        				<div className={styles.authPannelContainer}>
        					<Switch>
        						<Route path="/:loc/auth/login" component={Login}/>
        						<Route path="/:loc/auth/register" component={Register}/>
        						<Route path="/:loc/auth/forgot" component={ForgotPassword}/>
        					</Switch>
        			    </div>
        		    </div>
            	)}/>
           	</Switch>
        </CSSTransitionGroup>
    }
}

export default withRouter(Auth);

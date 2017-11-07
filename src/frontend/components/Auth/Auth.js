import React from "react";
import { Switch, Route, Redirect } from 'react-router-dom'
import { withRouter } from "react-router"
import { CSSTransitionGroup } from 'react-transition-group'
import PropTypes from "prop-types"

import Login from './Login'
import Register from './Register'
import ForgotPassword from './ForgotPassword'
import styles from '../Common/form.css'

class Auth extends React.Component {
    render() {
        return <CSSTransitionGroup
        	component="div"
            transitionName={{
    			enter: styles.formDialogEnter,
    		    enterActive: styles.formDialogEnterActive,
    		    leave: styles.formDialogLeave,
    		    leaveActive: styles.formDialogLeaveActive,
            }}
            transitionEnterTimeout={300}
            transitionLeaveTimeout={300}>
            <Switch key={this.props.location.pathname} location={this.props.location}>
            	<Route path="/:loc/auth" component={()=>(
            		<div className={styles.formDialogBackground}>
        				<div className={styles.formDialogContainer}>
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

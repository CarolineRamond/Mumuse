import React from "react";
import { Switch, Route, Redirect } from 'react-router-dom'
import { withRouter } from "react-router"
import { CSSTransitionGroup } from 'react-transition-group'
import PropTypes from "prop-types"

import UsersTable from './UsersTable'
import UsersCreate from './UsersCreate'
import UsersEdit from './UsersEdit'
import styles from '../../Common/form.css'

class Users extends React.Component {
    render() {
        return <div>
            <UsersTable/>
                <Switch  key={this.props.location.pathname} location={this.props.location}>
                    <Route path="/admin/users/create" component={UsersCreate}/>
                    <Route path="/admin/users/edit/:userId" component={UsersEdit}/>
                </Switch>
        </div>
    }
}

// Props :
// * location : current route location, provided by function withRouter (required)
// * match : current route match, provided by function withRouter
// * history : current router history, provided by function withRouter
Users.propTypes = {
    location: PropTypes.object.isRequired, 
    match: PropTypes.object, 
    history: PropTypes.object 
}

export default withRouter(Users);

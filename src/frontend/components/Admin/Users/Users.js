import React from "react";
import { Switch, Route, Redirect } from 'react-router-dom'
import { withRouter } from "react-router"
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
// * location : current route location, inherited from Route component (required)
// * match : current route match, inherited from Route component
// * history : current router history, inherited from Route component
Users.propTypes = {
    location: PropTypes.object.isRequired, 
    match: PropTypes.object, 
    history: PropTypes.object 
}
export default Users;

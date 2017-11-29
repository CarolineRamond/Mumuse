import React from 'react';
import { Switch, Route } from 'react-router-dom';
import PropTypes from 'prop-types';

import UsersTable from './UsersTable';
import UsersCreate from './UsersCreate';
import UsersEdit from './UsersEdit';

class Users extends React.Component {
    render () {
        return <div>
            <UsersTable/>
            <Switch key={this.props.location.pathname} location={this.props.location}>
                <Route path='/admin/users/create' component={UsersCreate}/>
                <Route path='/admin/users/edit/:userId' component={UsersEdit}/>
            </Switch>
        </div>;
    }
}

// Props :
// * location : current route location, inherited from Route component (required)
// * match : current route match, inherited from Route component
// * history : current router history, inherited from Route component
Users.propTypes = {
    history: PropTypes.object,
    location: PropTypes.object.isRequired,
    match: PropTypes.object
};
export default Users;

import React from 'react';
import { Switch, Route } from 'react-router-dom';
import PropTypes from 'prop-types';

import UsersTable from './UsersTable';
import UsersCreate from './UsersCreate';
import UsersEdit from './UsersEdit';

class Users extends React.Component {
    render() {
        return (
            <div>
                <UsersTable />
                <Switch key={this.props.location.pathname} location={this.props.location}>
                    <Route path="/admin/users/create" component={UsersCreate} />
                    <Route path="/admin/users/edit/:userId" component={UsersEdit} />
                </Switch>
            </div>
        );
    }
}

Users.propTypes = {
    /** current router history, inherited from Route component */
    history: PropTypes.object,

    /** current route location, inherited from Route component */
    location: PropTypes.object.isRequired,

    /** current route match, inherited from Route component */
    match: PropTypes.object
};
export default Users;

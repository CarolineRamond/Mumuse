import React from 'react';
import { Switch, Route } from 'react-router-dom';
import PropTypes from 'prop-types';

import Login from './Login';
import Register from './Register';
import ForgotPassword from './ForgotPassword';
import ResetPassword from './ResetPassword';

class Auth extends React.Component {
    render() {
        return (
            <Switch>
                <Route path="/:loc/auth/login" component={Login} />
                <Route path="/:loc/auth/register" component={Register} />
                <Route path="/:loc/auth/forgot" component={ForgotPassword} />
                <Route path="/:loc/auth/reset" component={ResetPassword} />
            </Switch>
        );
    }
}

// Props :
// * history : current router history, inherited from Route component
// * location : current route location, inherited from Route component (required)
// * match : current route match, inherited from Route component
Auth.propTypes = {
    history: PropTypes.object,
    location: PropTypes.object.isRequired,
    match: PropTypes.object
};

export default Auth;

import React from 'react';
import { connect } from 'react-redux';
import { Route } from 'react-router-dom';
import { Tab, Tabs } from 'react-toolbox';
import PropTypes from 'prop-types';

import { actions } from '../../modules';
const { fetchAuthUser } = actions;
import { selectors } from '../../modules';
const { getAuthUserState } = selectors;

import Users from './Users';
import styles from './admin.css';

class Admin extends React.Component {
    constructor(props) {
        super(props);
        this.handleTabChange = this.handleTabChange.bind(this);
        this.state = {
            authorized: false // true if user is authorized to access this state
        };
    }

    componentDidMount() {
        // fetch currently authenticated user to know if access is authorized
        this.props.dispatch(fetchAuthUser());
    }

    componentWillReceiveProps(nextProps) {
        if (!nextProps.authUserState.pending && this.props.authUserState.pending) {
            // fetch user action is not pending anymore
            if (
                nextProps.authUserState.data &&
                nextProps.authUserState.data.roles.indexOf('admin') > -1
            ) {
                // an admin user is connected : setup tabs & location
                // => will render the admin panel
                let index;
                if (this.props.location.pathname.indexOf('/admin/users') > -1) {
                    index = 0;
                } else if (this.props.location.pathname.indexOf('/admin/test') > -1) {
                    index = 1;
                } else {
                    index = 0;
                    this.props.history.replace('/admin/users');
                }
                this.setState({
                    authorized: true,
                    index: index
                });
            } else {
                // no admin user is connected : access is unauthorized
                // => will render 'Forbidden'
                this.setState({
                    authorized: false
                });
            }
        }
    }

    handleTabChange(index) {
        // switch window location on tab change
        this.setState({ index });
        switch (index) {
            case 0:
                this.props.history.push('/admin/users');
                break;
            case 1:
                this.props.history.push('/admin/test');
                break;
            default:
                break;
        }
    }

    render() {
        if (this.props.authUserState.pending) {
            // authenticated user is being fetched
            return <div>Loading...</div>;
        } else if (this.state.authorized) {
            // authenticated user is authorized
            return (
                <div className={styles.adminPanel}>
                    <h1 className={styles.adminTitle}>Admin</h1>
                    <Tabs
                        className={styles.adminTabs}
                        index={this.state.index}
                        onChange={this.handleTabChange}
                        theme={{
                            navigationContainer: styles.adminNavigationContainer,
                            tab: styles.adminTab
                        }}
                    >
                        <Tab label="Users">
                            <Route path="/admin/users" component={Users} />
                        </Tab>
                        <Tab label="Test">
                            <Route path="/admin/test" component={() => <div>TEST</div>} />
                        </Tab>
                    </Tabs>
                </div>
            );
        } else {
            // authenticated user is not authorized
            return <div>Forbidden</div>;
        }
    }
}

// Props :
// * authUserState : state of the request FETCH_AUTH_USER, provided by connect, required
// *	pending: boolean, true if a request is on going
// *	data: contains currently authenticated user (if any) once the request is finished
// *	error: contains an error string if no authenticated user was retrieved
// * dispatch: redux store dispatch function, provided by connect (required)
// * history: current router history, inherited from Route component (required)
// * location: current route location, inherited from Route component (required)
// * match: current route match, inherited from Route component
Admin.propTypes = {
    authUserState: PropTypes.shape({
        pending: PropTypes.bool,
        data: PropTypes.object,
        error: PropTypes.string
    }).isRequired,
    dispatch: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    match: PropTypes.object
};

const ConnectedAdmin = connect(store => {
    return {
        authUserState: getAuthUserState(store)
    };
})(Admin);

export default ConnectedAdmin;

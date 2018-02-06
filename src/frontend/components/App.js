import React from 'react';
import { HashRouter as Router, Route, Switch, Redirect } from 'react-router-dom';

import Admin from './Admin';
import Auth from './Auth';
import Main from './Main';
import MainRouter from './Main/MainRouter';

const App = () => {
    return (
        <Router>
            <Switch>
                <Route path="/admin*" component={Admin} />
                <Route
                    path="/:loc"
                    component={() => (
                        <div>
                            <Route path="/:loc/auth" component={Auth} />
                            <Main />
                            <MainRouter />
                        </div>
                    )}
                />
                <Redirect to="/21,6,1" />
            </Switch>
        </Router>
    );
};

export default App;

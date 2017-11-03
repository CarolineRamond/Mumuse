import React from "react";
import { HashRouter as Router, Route, Switch, Redirect} from 'react-router-dom'

import Main from './Main'
import Auth from './Auth'

const App = () => (
	<Router>
	  	<Switch>
		    {/*<Route exact path="/admin" component={Admin}/>*/}
		    <Route path="/:loc" component={Main}/>
		    <Redirect to="/21,6,1"/>
	    </Switch>
	</Router>
)

export default App;
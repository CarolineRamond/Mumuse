import React from "react";
import { HashRouter as Router, Route, Switch, Redirect} from 'react-router-dom'

import Admin from './Admin'
import Auth from './Auth'
import Main from './Main'

const App = () => {
	return <Router>
	  	<Switch>
		    <Route path="/admin*" component={Admin}/>
		    <Route path="/:loc" component={()=>(
		    	<div>
		    		<Auth/>	
			        <Main/>
			    </div>
		    )}/>
		    <Redirect to="/21,6,1"/>
	    </Switch>
	</Router>
}

export default App;
import React from 'react'
import ReactDOM from "react-dom"
import { Provider } from "react-redux"
import { CSSTransitionGroup } from 'react-transition-group'
import { HashRouter as Router, Route, Switch, Redirect } from 'react-router-dom'
import styles from './css/test.css'
import Layout from './components/Layout'
import Auth from './components/Auth'
import store from "./store"

const App = () => (
	<Router>
	  	<Switch>
		    <Route path="/:loc" render={({ history, location }) => {
		    	return <div>
			        <Layout location={location} history={history}/>
			        <CSSTransitionGroup
			        	component="div"
			            transitionName={{
							enter: styles.enter,
						    enterActive: styles.enterActive,
						    leave: styles.leave,
						    leaveActive: styles.leaveActive,
			            }}
			            transitionEnterTimeout={300}
			            transitionLeaveTimeout={300}>
			            <Switch key={location.pathname} location={location}>
				        	<Route path="/:loc/auth" component={Auth}/>
				       	</Switch>
				    </CSSTransitionGroup>
		        </div>
		    }}/>
		    <Redirect to="/21,6,1"/>
	    </Switch>
	</Router>
)


ReactDOM.render(<Provider store={store}>
  <App/>
</Provider>, document.getElementById('app'));
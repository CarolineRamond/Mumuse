import React from "react"
import ReactDOM from "react-dom"
import { Provider } from "react-redux"
import { HashRouter as Router, Route, Switch, Link } from 'react-router-dom'

import store from "./store"
import Layout from './components/Layout'
import Auth from './components/Auth'

const App = ()=>(
  <Router>
    <div>
      <Layout/>
      <Switch>
        <Route path="/auth" component={Auth}/>
      </Switch>
    </div>
  </Router>
)

ReactDOM.render(<Provider store={store}>
  <App/>
</Provider>, document.getElementById('app'));

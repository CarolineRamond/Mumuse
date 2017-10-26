import React from "react"
import ReactDOM from "react-dom"
import { Provider } from "react-redux"
import "react-mdl/extra/material.js"
import "react-mdl/extra/material.css"

import App from "./components/App"
import store from "./store"

ReactDOM.render(<Provider store={store}>
	<App/>
</Provider>, document.getElementById('app'));
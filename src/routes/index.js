import React from "react"
import { Router, Link } from "@reach/router"
import Home from "./home"
import Item from "./item"

const App = ({ children }) => (
  <div className="app">
    <nav className="nav">
      <Link to="/">Home</Link> 
      <Link to="item/1">Item 1</Link>
      <Link to="item/2">Item 2</Link> 
    </nav>
    {children}
  </div>
)

const Root = () => (
  <Router>
    <App path='/'>
      <Home path="/" />
      <Item path="item/:itemId" />
    </App>
  </Router>
)

export default Root
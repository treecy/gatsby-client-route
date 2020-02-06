import * as React from "react"
import { Router, Link, RouteComponentProps } from "@reach/router"
import Home from "./home"
import Item from "./item"
import About from "./about"

const App: React.FC<RouteComponentProps> = ({ children }) => (
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
      <About path="/about" />
      <Item path="/item/:itemId" />
    </App>
  </Router>
)

export default Root
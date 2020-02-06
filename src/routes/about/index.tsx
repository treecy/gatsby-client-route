import React from "react"
import { RouteComponentProps } from "@reach/router"

interface Props extends RouteComponentProps {
}

const Home: React.FC<Props> = () => (
  <div>
    <h2>About!</h2>
  </div>
)

export default Home
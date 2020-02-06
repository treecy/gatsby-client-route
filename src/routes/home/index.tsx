import React, {useEffect, useState} from "react"
import { RouteComponentProps } from "@reach/router"

interface Props extends RouteComponentProps {
}

const Time = ({time}) => <p>Current time: {time}</p>

const Home: React.FC<Props> = () => {
  const [date, setDate] = useState('000')
  useEffect(() => {
    setTimeout(()=> setDate('111'), 5000)
  })

  // const location = window.location;

  return (
    <div>
      <h2>Welcome!</h2>
      <p>
        Select a user, their ID will be parsed from the URL and passed to the User
        component
      </p>
      <Time time={date}/>
    </div>
  )
}

export default Home
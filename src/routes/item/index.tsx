import * as React from "react"
import { RouteComponentProps } from "@reach/router"

interface Props extends RouteComponentProps {
  itemId?: string;
}

const Item:React.FC<Props> = ({itemId}) => {
  console.log(window.location)
  if (!itemId){
    return (
      <div>Page not found</div>
    )
  }


  return (
    <div>
      <h1>Item Details</h1>
      <h2>Item id: {itemId}</h2>
    </div>
  )
}

export default Item;
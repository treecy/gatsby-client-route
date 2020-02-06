import * as React from "react"
import loadable from '@loadable/component'

const Root = loadable(() => import(/* webpackChunkName: "root" */ './routes'))

export default () => <Root />


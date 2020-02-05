const pageConfig = [
  {
    path: '/',
    component: require.resolve("./src/routes/index.js"),
  },
  {
    path: '/item',
    matchPath: '/item/*',
    component: require.resolve("./src/routes/index.js"),
  }
]

exports.createPages = async ({ actions: { createPage } }) => {
  pageConfig.forEach(page => createPage(page))
}
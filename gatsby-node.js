const Prerender = require('./script/prerender');
const path = require('path');
const pageConfig = [
  {
    path: '/',
    component: require.resolve("./src/routes/index.tsx"),
  },
  {
    path: '/about',
    component: require.resolve("./src/routes/index.tsx"),
  },
  {
    path: '/item',
    matchPath: '/item/*',
    component: require.resolve("./src/routes/index.tsx"),
    context: {
      itemId: '123'
    }
  }
]

exports.createPages = async ({ actions: { createPage } }) => {
  // pageConfig.forEach(page => createPage(page))
  createPage({
    path: '/',
    matchPath: '/*',
    component: require.resolve("./src/index.tsx"),
  })
}

exports.onPostBuild = async () => {
  const renderer = new Prerender({
    staticDir: path.join(__dirname, 'public'),
    outputDir: path.join(__dirname, 'public/prerendered'),
    routes: ['/', '/item/123'],
    postProcess (renderedRoute) {
      try {
        console.log(renderedRoute.route)
        if (renderedRoute.originalRoute.startsWith('/item')){
          const outputPath = path.join(__dirname, '/public/prerendered/item/index.html')
          renderedRoute.outputPath = outputPath
        }
      }catch(e){
        console.log(e)
      }
      return renderedRoute
    }
  });
  await renderer.render();
  console.log('onPostBuild <------')
}
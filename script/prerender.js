const path = require('path')
const fs = require('fs')
const Prerenderer = require('@prerenderer/prerenderer')
const PuppeteerRenderer = require('@prerenderer/renderer-puppeteer')
const { minify } = require('html-minifier')

function PrerenderSPAPlugin (options) {
  const rendererOptions = {
    renderAfterElementExists: '.app'
  } // Primarily for backwards-compatibility.

  this._options = options

  this._options.server = this._options.server || {}
  this._options.renderer = this._options.renderer || new PuppeteerRenderer(Object.assign({}, { headless: true }, rendererOptions))
}

// From https://github.com/ahmadnassri/mkdirp-promise/blob/master/lib/index.js
const mkdirp = function (dir, opts) {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(dir)) {
      fs.mkdir(dir, opts, (err) => err ? reject(err) : resolve())
    }
    resolve()
  })
}

PrerenderSPAPlugin.prototype.render = function () {
  const PrerendererInstance = new Prerenderer(this._options)

  return PrerendererInstance.initialize()
    .then(() => {
      return PrerendererInstance.renderRoutes(this._options.routes || [])
    })

    .then(renderedRoutes => this._options.postProcess
      ? Promise.all(renderedRoutes.map(renderedRoute => this._options.postProcess(renderedRoute)))
      : renderedRoutes
    )
    // Check to ensure postProcess hooks returned the renderedRoute object properly.
    .then(renderedRoutes => {
      const isValid = renderedRoutes.every(r => typeof r === 'object')
      if (!isValid) {
        throw new Error('[prerender-spa-plugin] Rendered routes are empty, did you forget to return the `context` object in postProcess?')
      }

      return renderedRoutes
    })
    // Minify html files if specified in config.
    .then(renderedRoutes => {
      if (!this._options.minify) return renderedRoutes

      renderedRoutes.forEach(route => {
        route.html = minify(route.html, this._options.minify)
      })

      return renderedRoutes
    })
    // Calculate outputPath if it hasn't been set already.
    .then(renderedRoutes => {
      renderedRoutes.forEach(rendered => {
        if (!rendered.outputPath) {
          rendered.outputPath = path.join(this._options.outputDir || this._options.staticDir, rendered.route, 'index.html')
        }
      })

      return renderedRoutes
    })
    // Create dirs and write prerendered files.
    .then(processedRoutes => {
      console.log('[prerender plugin] Create dirs and write prerendered files.')

      return Promise.all(processedRoutes.map(processedRoute => {
        return mkdirp(path.dirname(processedRoute.outputPath))
          .then(() => {
            return new Promise((resolve, reject) => {
              fs.writeFile(processedRoute.outputPath, processedRoute.html.trim(), err => {
                if (err) reject(`[prerender-spa-plugin] Unable to write rendered route to file "${processedRoute.outputPath}" \n ${err}.`)
                else resolve()
              })
            })
          })
          .catch(err => {
            console.log(err)
            if (typeof err === 'string') {
              err = `[prerender-spa-plugin] Unable to create directory ${path.dirname(processedRoute.outputPath)} for route ${processedRoute.route}. \n ${err}`
            }

            throw err
          })
      }))
    })
    .then(r => {
      PrerendererInstance.destroy()
      return {msg: 'done'}
    })
    .catch(err => {
      PrerendererInstance.destroy()
      const msg = `[prerender] Unable to prerender all routes! ${err.stack}`
      console.error(msg)
    })
}

PrerenderSPAPlugin.PuppeteerRenderer = PuppeteerRenderer

module.exports = PrerenderSPAPlugin
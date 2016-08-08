'use strict'
var koa = require('koa')
  , router = require('koa-router')()
  , generators = require('./generators')
  , GitStore = require('./lib/GitStore')
  , GitApi = require('./lib/GitApi')

// create a local GitStore object that will stay in sync with remote repo
let gitStore = new GitStore(process.env.REPO)

let gitApi = new GitApi(gitStore)

// exports a koa middleware generator to handle requests to any of the urls listed above
module.exports = gitApi.api

if (!module.parent) {
  let app = koa()
  let port = process.env.PORT || 3000
  app.use(module.exports)
  app.listen(port)
  console.log(`Git-store API listening on port ${port}.`)
}

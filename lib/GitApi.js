var generators = require('../generators')
  , router = require('koa-router')()


module.exports = function(store) {

  this.store = store

  // initialize various koa generators that serve as api endpoints for git
  router.get('/list', generators.IndexGenerator)
  router.get('/get/*', generators.GetGenerator)
  router.get('/raw/*', generators.RawGenerator)
  router.get('/tree/*', generators.TreeGenerator)
  router.get('/commit/:hash', generators.CommitGenerator)
  router.get('/blame/*', generators.BlameGenerator)
  router.get('/feed', generators.FeedGenerator)
  router.get('/feed/:hash', generators.FeedGenerator)

  // endpoint to trigger a git pull
  router.post('/gitPull', generators.GitPullGenerator)

  this.api = router.routes()

}

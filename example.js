var koa = require('koa')
var app = koa()
var gitStore = require('git-store') // require('git-store') once installed via npm

app.use(gitStore)

app.listen(3000)

module.exports = app

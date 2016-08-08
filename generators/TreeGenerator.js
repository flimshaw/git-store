'use strict'
var thunkify = require('thunkify')
  , exec = require('child_process').exec
  , thunkExec = thunkify(exec)

module.exports = function *TreeGenerator() {

  let p = this.params[0].split('/')
    , hash = p.shift()
    , path = p.join('/')

  try {
    // process recently updated files from git.log
    var result = yield thunkExec(`git ls-tree ${hash}:${path}`, { cwd: `${process.cwd()}/store` } )
    var list = result[0].trim().split('\n')

    var items = list.map( (item) => {
      let i = item.split('\t')
        , m = i[0].split(' ')
        , f = i[1]
      return {
        type: m[1],
        path: f,
        id: m[2]
      }
    })
    this.body = items
  } catch (err) {
    this.status = 404
  }

}

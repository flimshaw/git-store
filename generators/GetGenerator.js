'use strict'
var fs = require('fs')
, thunkify = require('thunkify')
, read = thunkify(fs.readFile)
, exec = require('child_process').exec
, thunkExec = thunkify(exec)

module.exports = function *GetGenerator() {

  let p = path.split('/')
    , hash = 'HEAD'

  if(p[0].length === 7) {
    hash = p.shift()
    path = p.join('/')
  }

  try {
    // process recently updated files from git.log
    var result = yield thunkExec(`git show ${hash}:${path}`, { cwd: `${process.cwd()}/store` } )
    var history = yield thunkExec(`git log --format="[%h] [%cr] [%s]" ${hash}:${path}`, { cwd: `${process.cwd()}/store` } )

    result = {
      path: path,
      content: result[0],
      metadata: history
    }
  } catch (err) {
    throw err
  }


  this.body = yield result
}

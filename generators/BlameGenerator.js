'use strict'
var fs = require('fs')
, thunkify = require('thunkify')
, read = thunkify(fs.readFile)
, exec = require('child_process').exec
, thunkExec = thunkify(exec)

module.exports = function *BlameGenerator(path) {

  console.log(path)

  try {
    // process recently updated files from git.log
    var result = yield thunkExec(`git blame ${path}`, { cwd: `${process.cwd()}/store` } )
    result = {
      path: path,
      content: result[0]
    }
  } catch (err) {
    throw err
  }


  this.body = yield result
}

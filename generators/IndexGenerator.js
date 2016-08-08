'use strict'
var fs = require('fs')
, thunkify = require('thunkify')
, read = thunkify(fs.readFile)
, exec = require('child_process').exec
, thunkExec = thunkify(exec)

module.exports = function *IndexGenerator() {

  try {
    // process recently updated files from git.log
    var result = yield thunkExec(`git log --pretty="format:" --name-only --`, { cwd: `${process.cwd()}/store` } )
    result = result[0].split('\n')
    result = Array.from(new Set(result))

    // split each into a hash, a filename
    let re = /(.*) \((.*) ([0-9]+)\) (.*)/

    result = result.filter( (file) => { return file !== '' })
  } catch (err) {
    throw err
  }


  this.body = yield result
}

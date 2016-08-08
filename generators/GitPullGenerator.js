'use strict'
var fs = require('fs')
, thunkify = require('thunkify')
, read = thunkify(fs.readFile)
, exec = require('child_process').exec
, thunkExec = thunkify(exec)

module.exports = function *GitPullGenerator() {

  try {
    yield thunkExec(`git fetch origin refs/notes/*:refs/notes/*`, { cwd: `${process.cwd()}/store` } ) // and retrieve any notes that have been updated as well
    var result = yield thunkExec(`git pull`, { cwd: `${process.cwd()}/store` } ) // process recently updated files from git.log

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

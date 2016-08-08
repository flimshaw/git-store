'use strict'
var fs = require('fs')
, thunkify = require('thunkify')
, read = thunkify(fs.readFile)
, exec = require('child_process').exec
, thunkExec = thunkify(exec)

module.exports = function *LogGenerator() {

  try {
    // process recently updated files from git.log
    var result = yield thunkExec(`git log ${this.params[0]}`, { cwd: `${process.cwd()}/store` } )
  } catch (err) {
    throw err
  }


  // convert lines into an array
  result = result[0].split('\n')

  // remove empty items
  result = result.filter( (file) => { return file !== '' })


  this.body = yield result
}

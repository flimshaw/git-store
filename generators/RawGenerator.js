'use strict'
var fs = require('fs')
  , spawn = require('child_process').spawn

module.exports = function *RawGenerator() {

  let p = this.params[0].split('/')
    , hash = p.shift()
    , type = this.params[0].substr(this.params[0].lastIndexOf('.') + 1)
    , filePath = p.join('/')

  this.type = type
  try {
    let result = spawn(`git`, [`show`, `${hash}:${filePath}`], { cwd: `${process.cwd()}/store` } )
    this.body = result.stdout
  } catch (err) {
    console.log(err)
    this.status = 404
  }
}

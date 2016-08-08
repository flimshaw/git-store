'use strict'
var fs = require('fs')
, thunkify = require('thunkify')
, read = thunkify(fs.readFile)
, exec = require('child_process').exec
, thunkExec = thunkify(exec)

function parseLogIntoCommits( ) {

  let lines = this.params.hash.split('\n')
  let commits = []

  // loop through the raw lines of the git response and parse it
  lines.map( (line, i) => {
    // if this is the start of a new commit, create it
    if(line.substr(0,2) === "@@") {
      let meta = line.split("@@")
      let commit = {
        hash: meta[1],
        message: meta[2],
        timestamp: meta[3],
        notes: meta[4],
        files: []
      }
      commits.push(commit)
    } else {
      if(line.length > 0) {
        commits[ commits.length - 1 ].files.push(line)
      }
    }
  })

  // filter out notes with certain attributes
  commits = commits.filter( commit => commit.notes === 'private' ? false : true )

  return commits

}

module.exports = function *CommitGenerator(hash) {
  hash = hash !== undefined ? hash : ""
  try {
    // process recently updated files from git.log
    var result = yield thunkExec(`git log -n 1 --pretty=format:@@%h@@%s@@%ct@@%N --name-only ${hash} | sed '/^$/d'`, { cwd: `${process.cwd()}/store` } )
    var commits = parseLogIntoCommits( result[0] )
    if( commits.length <= 0 ) {
      console.error(`INVALID COMMIT: ${hash}`)
    }
  } catch (err) {
    throw err
  }


  this.body = yield commits[0]
}

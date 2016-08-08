'use strict'
var fs = require('fs')
, thunkify = require('thunkify')
, read = thunkify(fs.readFile)
, exec = require('child_process').exec
, thunkExec = thunkify(exec)

function parseLogIntoCommits( gitLog ) {

  let lines = gitLog.split('\n')
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
      commits[ commits.length - 1 ].files.push(line)
    }
  })

  // filter out notes with certain attributes
  commits = commits.filter( commit => commit.notes === 'private' ? false : true )

  return commits

}

module.exports = function *FeedGenerator(hash) {
  hash = hash !== undefined ? hash : ""
  try {
    // process recently updated files from git.log
    var result = yield thunkExec(`git log -n 10 --pretty=format:@@%h@@%s@@%ct@@%N --name-only | sed '/^$/d'`, { cwd: `${process.cwd()}/store` } )
    let commits = parseLogIntoCommits( result[0] )
  } catch (err) {
    throw err
  }


  this.body = yield parseLogIntoCommits( result[0] )
}

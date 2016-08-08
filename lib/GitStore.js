'use strict'
var spawn = require('child_process').spawn
var EventEmitter = require('events').EventEmitter

const LOADING = 'LOADING'
    , READY = 'READY'
    , FAILED = 'FAILED'
    , RESET = 'RESET'

/*
   Class: GitStore
   A class that keeps a local clone of a git repository up to date, and notifies
   subscribers of changes made to it.
*/
class GitStore extends EventEmitter {

  /*
     Constructor: GitStore
     Initializes the git repository and sets up listeners to poll for updates at
     regular intervals.

     Parameters:

     url - The github url for the repository
     options - optional options
  */
  constructor(url, options) {
    super()
    options = options || {}
    this.url = url
    this.cwd = options.storePath || `./store`
    this.setState(RESET)
    this.lastUpdated = 0
    this.pullInterval = options.pullInterval || 10
    this.failedInterval = options.failedInterval || 10

    // begin a low-impact update loop that runs once per pullInterval
    setInterval( this.update.bind(this), this.pullInterval * 60 * 1000 )
    this.update()
  }

  /*
     Function: setState
     This is called whenever there is a state change on the store

     Parameters:

     state - The state to which the consumer should be set, emits an 'update' event with the state code
  */
  setState(state) {
    this.state = state
    this.emit('update', state)
    console.log(`State updated: ${state}`)
  }

  /*
     Function: Update
     A keep-alive function that responds based on the state of the processor to perform
     certain actions
  */
  update() {
    switch(this.state) {
      case RESET:
        // TODO delete all local files
        // attempt to clone the repo and then continue on
        this.cloneRepo().then( () => {
          this.setState(READY)
        }).catch( err => {
          this.setState(FAILED)
          console.error(`Error cloning repository: ${err}`)
        })
        this.setState(LOADING)
        break
      case LOADING:
        console.log(`Loading ${this.cwd}...`)
        break
      case READY:
        if( (Date.now() - this.lastUpdated) > this.pullInterval * 60 * 1000 ) {
          this.setState(LOADING)
          this.pullRepo()
        }
        break
      case FAILED:
        if( (Date.now() - this.lastUpdated) > this.failedInterval * 60 * 1000 ) {
          this.setState(LOADING)
          this.pullRepo()
        }
        break
    }
  }

  /*
     Function: cloneRepo
     Attempts to clone the configured repository from its source url

     Returns:

     Promise
  */
  cloneRepo() {
    console.log(`Cloning ${this.url}...`)
    return new Promise( (res, rej) => {

      var stream = spawn(`git`, [`clone`, `${this.url}`, `${this.cwd}`] )

      stream.stderr.on('data', (data) => {
        if(data.indexOf("does not exist") > 0) {
          console.log(data.toString())
          process.exit()
        }
      })

      stream.stdout.on('data', (data) => {
        console.log(data.toString())
      })

      stream.on('close', (err) => {
          if(err > 0 && err !== 128) {
            rej(err)
          } else {
            this.lastUpdated = Date.now()
            res()
          }
        })

    })
  }

  /*
     Function: pullRepo
     Attempts to pull the configured repository from its source url

     Returns:

     Promise
  */
  pullRepo() {
    return new Promise( (res, rej) => {
      console.log("Pulling repo...")

      var stream = spawn(`git`, [`pull`], { cwd: this.cwd } )

      stream.stdout.on('data', (data) => {
        console.log(data.toString('utf8'))
      })

      stream.on('close', (err) => {
        this.lastUpdated = Date.now()
        if(err === 1) {
          this.setState(FAILED)
          rej(err)
        } else {
          this.setState(READY)
          res()
        }
      })

    })
  }

}


module.exports = GitStore

# git-store

Git-store is middleware for [koa](http://koajs.com/) that pulls a remote git repository, and auto-updates when that repository changes. It also exposes a concise API for retrieving trees and blobs (ie. file listings and files) from that git repository at any commit in its history.  

## How to install

To install it as a global command line utility, try:

`npm install -g git-store`

Or to use git-store in a specific project, install with npm like so:

`npm install -D git-store`

## How to use as a command line tool

If you chose the global version above, the syntax is:

`git-store REPO_URL`

So, to create a synced git-store of this very repository, you would run:

`git-store git@github.com:flimshaw/git-store.git`

The repository will be cloned into the current directory in the 'store' subfolder.  Eventually there will be a second argument to specify a destination for the repo, but at the moment that feature is unstable.  

While this process is running, the repo will be periodically checked for updates and synced, and a web API will run at localhost:3000 that lets you query the repository in various ways.

## How to use it as koa middleware

I'll initially be using this tool in a docker environment, so that's the way I've tailored the configuration process.  Configuration is done by setting environment variables, so that changes to javascript can be as minimal as possible.  The included [example.js](./example.js) shows just how minimal the js configuration is at this point:

```
var koa = require('koa')
var app = koa()
var gitStore = require('git-store')

app.use(gitStore)

app.listen(3000)
```

To run this server and point to a repository of your choice, you would set the REPO environment variable before running the example, like so:

`REPO=git@github.com:flimshaw/git-store.git node example.js`

Or, just change the REPO environment variable in the included Dockerfile example to use this in a Docker environment.

## API Queries Supported

`/tree/:commit/:path` - returns the git tree at the given path and commit in history.  The commit can also be branch names and HEAD, so for example, `/tree/HEAD~1/` would return the root tree of the repository one commit in the past.
`/raw/:commit/:path` - streams the file as this path and point in history
`/gitPull` - POSTs to this url will trigger a git pull, useful for GitHub webhooks

## API Queries In Progress

`/blame/:commit/:path` - blame diffs for the given commit and path
`/feed/:page` - get the last 10 commits and modified files
`/commit/:commit` - retrieve info about a particular commit

## How does it work?

All blobs and trees queried at a specific commit may be considered *permanent*, and can be cached by consumers down the road indefinitely without the need to ever check for updates.  Files and trees retrieved via a branch or tag (dev, HEAD~1 etc) should be considered volatile.

## Config Defaults

Port: 4444
Protocol: REST / http

## Environment Variable Requirements

### PRIVATE_KEY

Path to a read-only deploy key for the given repository, if it is private.

### REPO

Path to the repository containing your store data.

'use strict';

const fs = require('fs')
const rmdir = require('rimraf')
const util = require('./src/util')
const args = require('./src/args')
const slack = require('./src/slack')
const save = require('./src/save')

// Process CLI arguments into the application config
var config = {}

try {
  config = args.process(process.argv.slice(2))
  args.check(config)
} catch (e) {
  // Don't show errors if the user requested a usage statement.
  if (!config.help) {
    console.error(e.message)
  }

  console.log(util.usage())
  return
}

// Exit early if the user requested a usage statement.
if (config.help) {
  console.log(util.usage())
  return
}

// Retrieve the team and users from Slack.
Promise.all([slack.getTeam(config), slack.getUsers(config)])
  .then(result => {
    var [team, users] = result

    // Parse the results from Slack into users for export.
    Promise.all(slack.buildUsers(team, users))
      .then(users => {
        // Export the users to disk.
        //
        // Re-initialize the export directory
        if (fs.existsSync(config.save_path)) {
          rmdir.sync(config.save_path, {}, util.throwError)
        }

        fs.mkdir(config.save_path, util.throwError)

        save.toVCard(config, users, util.throwError)
        save.toCsv(config, users, util.throwError)
      })
      .then(() => { console.log('Done') })
      .catch(e => { console.error(e) })
  })
  .catch(e => { console.error(e) })

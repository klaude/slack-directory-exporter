const util = require('./src/util')
const args = require('./src/args')
const slack = require('./src/slack')

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
        console.log('done')
      })
      .catch(e => { console.error(e) })
  })
  .catch(e => { console.error(e) })

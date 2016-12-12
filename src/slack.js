'use strict';

/**
 * Slack-facing methods
 */

const Slack = require('slack-node')
const https = require('https')

/**
 * Retrieve Slack team information.
 *
 * @see https://api.slack.com/methods/team.info
 * @param {Object} config
 * @returns {Promise}
 */
exports.getTeam = config => {
  return new Promise((resolve, reject) => {
    new Slack(config.token).api('team.info', (err, response) => {
      if (err) {
        reject(err)
      }

      if (!response.ok) {
        reject(response.error)
      }

      if (!response.team) {
        reject('No Slack team found.')
      }

      // console.log(response.team)
      resolve(response.team)
    })
  })
}

/**
 * Retrieve a list of users from a Slack directory.
 *
 * @see https://api.slack.com/methods/users.info
 * @param {Object} config
 * @returns {Promise}
 */
exports.getUsers = config => {
  return new Promise((resolve, reject) => {
    new Slack(config.token).api('users.list', (err, response) => {
      if (err) {
        reject(err)
      }

      if (!response.ok) {
        reject(response.error)
      }

      if (!response.members) {
        reject('No Slack users found.')
      }

      resolve(response.members.filter(user => {
        // Filter out former users and bots.
        return !user.deleted && !user.is_bot && user.name !== 'slackbot'
      }))
    })
  })
}

/**
 * Build a list of users from raw Slack user and team information.
 *
 * @param {Object} team
 * @param {Array} users
 * @returns {Array|*|{}}
 */
exports.buildUsers = (team, users) => {
  return users.map(user => {
    // Build a generic user object.
    var built = {
      'cellPhone': user.profile.phone,
      'firstName': user.profile.first_name,
      'lastName': user.profile.last_name,
      'organization': team.name,
      'photo': null,
      'skype': user.profile.skype,
      'slack': '@' + user.name,
      'title': user.profile.title,
      'workEmail': user.profile.email
    }

    // Retrieve the user's photo.
    return new Promise((resolve, reject) => {
      // Don't attempt to retrieve a photo if the user doesn't have one
      // defined.
      if (!user.profile.image_original) {
        resolve(built)
      }

      // Attach the user's photo to the resolved user object.
      https.get(user.profile.image_original, response => {
        response.on('data', photo => {
          built.photo = photo
          resolve(built)
        })
      })

      // If there was an error retrieving the user's photo then carry on with
      // the user's other information.
      .on('error', e => {
        resolve(built)
      })
    })
  })
}

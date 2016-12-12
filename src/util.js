/**
 * Common miscellaneous functions.
 */

/**
 * Build a program usage statement.
 *
 * @returns {string}
 */
exports.usage = () => {
  return '\n' + `
Export Slack directory users to common contact formats

Options: 
  --token=<token>    A Slack API token (REQUIRED)
  --save_path=<path> The directory to save contacts to
  --help             Print this usage statement

`.trim() + '\n'
}

/**
 * A common error handling callback for fs module calls.
 *
 * @param {Error} err
 */
exports.throwError = err => {
  if (err) {
    throw err
  }
}

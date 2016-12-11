/**
 * Build a program usage statement.
 *
 * @returns {string}
 */
exports.usage = () => {
  return '\n' + `
Export Slack directory users to common contact formats

Options: 
  --token: A Slack API token (REQUIRED)
  --help:  Print this usage statement

`.trim() + '\n'
}

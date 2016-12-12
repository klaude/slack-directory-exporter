'use strict';

/**
 * Argument parsing helpers on top of the minimist library.
 *
 * @see https://github.com/substack/minimist
 */

/**
 * Process command line arguments into an object with default values.
 *
 * @param argv
 */
exports.process = argv => {
  const DEFAULTS = {
    'format': 'vcard',
    'help': false,
    'save_path': './export'
  }

  return require('minimist')(argv, {'default': DEFAULTS})
}

/**
 * Validate that all required arguments were provided.
 *
 * @param args
 */
exports.check = args => {
  const REQUIRED = ['token']

  REQUIRED.forEach(function checkRequiredArg (arg) {
    if (Object.keys(args).indexOf(arg) === -1) {
      throw new Error('Required argument ' + arg + ' is not defined.')
    }
  })
}

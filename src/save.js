/**
 * Contact export helpers.
 */

const fs = require('fs')
const VCard = require('vcards-js')
const csv = require('csv.js')

/**
 * Generate vCard contact files.
 *
 * @param {Object} config
 * @param {Array} users
 * @param {Function} callback
 */
exports.toVCard = (config, users, callback) => {
  fs.mkdir(config.save_path + '/vcf')

  // A single vCard with every contact.
  var allCards = config.save_path + '/vcf/all.vcf'

  users.forEach(user => {
    var cardFile = config.save_path + '/vcf/' + user.firstName + ' ' + user.lastName + '.vcf'

    // Parse user data into a vCard object.
    var vCard = VCard()
    vCard.firstName = user.firstName
    vCard.lastName = user.lastName
    vCard.organization = user.organization
    vCard.cellPhone = user.cellPhone
    vCard.title = user.title
    vCard.workEmail = user.workEmail

    vCard.socialUrls['skype'] = user.skype
    vCard.socialUrls['slack'] = user.slack

    // todo: add photo support.
    //
    // This may require fixing embedded photo support in vcards-js.

    // Write the vCard to the individual user's vCard and to the all-users
    // vCard.
    fs.writeFile(cardFile, vCard.getFormattedString(), callback)
    fs.appendFile(allCards, vCard.getFormattedString(), callback)
  })
}

/**
 * Generate Outlook CSV contact files.
 *
 * @param {Object} config
 * @param {Array} users
 * @param {Function} callback
 */
exports.toCsv = (config, users, callback) => {
  fs.mkdir(config.save_path + '/csv')

  // A single vCard with every contact.
  var allUsersFile = config.save_path + '/csv/all.csv'
  var allUsersCsv = []

  users.forEach(user => {
    var userFile = config.save_path + '/csv/' + user.firstName + ' ' + user.lastName + '.csv'

    // These CSV headers were taken from the sample Outlook CSV file at
    // https://support.office.com/en-us/article/Create-or-edit-csv-files-to-import-into-Outlook-4518d70d-8fe9-46ad-94fa-1494247193c7
    var userCsv = {
      'Title': null,
      'First Name': user.firstName,
      'Middle Name': null,
      'Last Name': user.lastName,
      'Suffix': null,
      'Company': user.organization,
      'Department': null,
      'Job Title': user.title,
      'Business Street': null,
      'Business Street 2': null,
      'Business Street 3': null,
      'Business City': null,
      'Business State': null,
      'Business Postal Code': null,
      'Business Country/Region': null,
      'Home Street': null,
      'Home Street 2': null,
      'Home Street 3': null,
      'Home City': null,
      'Home State': null,
      'Home Postal Code': null,
      'Home Country/Region': null,
      'Other Street': null,
      'Other Street 2': null,
      'Other Street 3': null,
      'Other City': null,
      'Other State': null,
      'Other Postal Code': null,
      'Other Country/Region': null,
      'Assistant\'s Phone': null,
      'Business Fax': null,
      'Business Phone': null,
      'Business Phone 2': null,
      'Callback': null,
      'Car Phone': null,
      'Company Main Phone': null,
      'Home Fax': null,
      'Home Phone': null,
      'Home Phone 2': null,
      'ISDN': null,
      'Mobile Phone': user.cellPhone,
      'Other Fax': null,
      'Other Phone': null,
      'Pager': null,
      'Primary Phone': null,
      'Radio Phone': null,
      'TTY/TDD Phone': null,
      'Telex': null,
      'Account': null,
      'Anniversary': null,
      'Assistant\'s Name': null,
      'Billing Information': null,
      'Birthday': null,
      'Business Address PO Box': null,
      'Categories': null,
      'Children': null,
      'Directory Server': null,
      'E-mail Address': user.workEmail,
      'E-mail Type': 'work',
      'E-mail Display Name': null,
      'E-mail 2 Address': null,
      'E-mail 2 Type': null,
      'E-mail 2 Display Name': null,
      'E-mail 3 Address': null,
      'E-mail 3 Type': null,
      'E-mail 3 Display Name': null,
      'Gender': null,
      'Government ID Number': null,
      'Hobby': null,
      'Home Address PO Box': null,
      'Initials': null,
      'Internet Free Busy': null,
      'Keywords': null,
      'Language': null,
      'Location': null,
      'Manager\'s Name': null,
      'Mileage': null,
      'Notes': null,
      'Office Location': null,
      'Organizational ID Number': null,
      'Other Address PO Box': null,
      'Priority': null,
      'Private': null,
      'Profession': null,
      'Referred By': null,
      'Spouse': null,
      'User 1': null,
      'User 2': null,
      'User 3': null,
      'User 4': null,
      'Web Page': null
    }

    // Add to the all-users list.
    allUsersCsv.push(userCsv)

    // Write the individual CSV file
    fs.writeFile(userFile, csv.encode([userCsv]), callback)
  })

  // Write the all-users CSV file
  fs.writeFile(allUsersFile, csv.encode(allUsersCsv), callback)
}

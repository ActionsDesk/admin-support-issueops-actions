const Command = require('../command')
const Result = require('../result')
const ParameterRequiredError = require('../../exceptions/ParameterRequiredError')
const ParameterValidationError = require('../../exceptions/ParameterValidationError')
const YAML = require('yaml')
const validate = require('validate.js')

class ParseIssueAction extends Command {
  async validate () {
    if (!this.params.org) {
      throw new ParameterRequiredError('A valid organization name is required.')
    }
    if (!this.params.repository) {
      throw new ParameterRequiredError('A valid repository name is required.')
    }
    if (!this.params.supportedOrgs) {
      throw new ParameterRequiredError(
        'Missing supportedOrgs in the configuration.'
      )
    }
    if (!this.params.issueNumber) {
      throw new ParameterRequiredError(
        'A valid repository issue number is required.'
      )
    }
  }

  async execute () {
    // get issue body
    const owner = this.params.org
    const repo = this.params.repository
    const issueNumber = this.params.issueNumber

    const issueContent = await this.api.v3.issues.get({
      owner,
      repo,
      issue_number: issueNumber
    })

    // parse issue body
    const info = YAML.parse(issueContent.data.body)
    const ticket = this.findObjectKeyInsensitive(info, 'ticket')
    const parsedValues = {
      target_org: this.findObjectKeyInsensitive(info, 'organization'),
      description: this.findObjectKeyInsensitive(info, 'description'),
      ticket: Number.isInteger(ticket) ? ticket.toString() : ticket,
      duration: this.findObjectKeyInsensitive(info, 'duration')
    }

    const orgRegex = /^[a-z\d]+(?:-?[a-z\d]+)*$/i
    const constraints = {
      target_org: {
        type: 'string',
        presence: { allowEmpty: false },
        inclusion: this.params.supportedOrgs,
        format: orgRegex
      },
      description: {
        type: 'string',
        presence: { allowEmpty: false }
      },
      ticket: {
        type: 'string',
        presence: { allowEmpty: false }
      },
      duration: {
        type: 'number',
        presence: { allowEmpty: false },
        numericality: {
          onlyInteger: true,
          greaterThan: 0,
          lessThanOrEqualTo: 8
        }
      }
    }
    const validation = validate(parsedValues, constraints)
    if (!validate.isEmpty(validation)) {
      throw new ParameterValidationError(JSON.stringify(validation))
    }
    // Output
    return new Result('success', JSON.stringify(parsedValues))
  }

  findObjectKeyInsensitive (obj, searchKey) {
    return obj[Object.keys(obj).find(key => key.toLowerCase() === searchKey.toLowerCase())]
  }

  static getName () {
    return 'parse_issue'
  }
}

module.exports = ParseIssueAction

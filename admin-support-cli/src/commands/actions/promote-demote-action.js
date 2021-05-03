const Command = require('../command')
const Result = require('../result')
const ParameterRequiredError = require('../../exceptions/ParameterRequiredError')

class PromoteDemoteAction extends Command {
  async validate () {
    if (!this.params.username) {
      throw new ParameterRequiredError('A valid username is required.')
    }
    if (!this.params.targetOrg) {
      throw new ParameterRequiredError('A valid target organization name is required.')
    }
    if (!this.params.role || !['admin', 'member'].includes(this.params.role)) {
      throw new ParameterRequiredError('A valid role is required: [admin|member]')
    }
  }

  async execute () {
    const org = this.params.targetOrg
    const username = this.params.username
    const role = this.params.role
    try {
      await this.api.v3.orgs.setMembershipForUser({
        org,
        username,
        role
      })
      const outputMessage = `The role of ${username} has been successfully changed to: ${role} in ${org}`
      return new Result('success', outputMessage)
    } catch (e) {
      console.error(`Failed to change the role of ${username} in ${org}`)
      console.error(`Status code: ${e.status}`)
      console.error(
        'Possible reasons: \n',
        '- Username is not a member of the organization \n',
        '- Personal access token provided does not have sufficient privileges \n',
        '- Organization does not exist \n',
        '- You do not have admin privileges for the organization provided')
    }
  }

  static getName () {
    return 'promote_demote'
  }
}

module.exports = PromoteDemoteAction

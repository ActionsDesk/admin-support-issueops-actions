const Command = require('../command')
const Result = require('../result')
const ParseIssueAction = require('./parse-issue-action')
const ParameterRequiredError = require('../../exceptions/ParameterRequiredError')

const HOUR_IN_MILLIS = 60 * 60 * 1000

class CheckAutoDemotionAction extends Command {
  validate () {
    if (!this.params.org) {
      throw new ParameterRequiredError('A valid organization name is required.')
    }
    if (!this.params.repository) {
      throw new ParameterRequiredError('A valid repository name is required.')
    }
  }

  async execute () {
    const listOfIssues = await this.api.v3.paginate(this.api.v3.issues.listForRepo, {
      owner: this.params.org,
      repo: this.params.repository,
      state: 'open',
      labels: 'user-promoted'
    })
    for (const issue of listOfIssues) {
      const parseCommand = new ParseIssueAction(this.api, { ...this.params, issueNumber: issue.number })
      await parseCommand.validate()
      const parsedIssue = await parseCommand.execute()
      const issueDuration = JSON.parse(parsedIssue.output).duration
      const promotedTime = Date.parse(issue.created_at)
      const passedTime = Date.now() - promotedTime
      if (passedTime > issueDuration * HOUR_IN_MILLIS) {
        await this.api.v3.issues.update({
          owner: this.params.org,
          repo: this.params.repository,
          issue_number: issue.number,
          state: 'closed'
        })
      }
    }

    return new Result('success')
  }

  static getName () {
    return 'check_auto_demotion'
  }
}

module.exports = CheckAutoDemotionAction

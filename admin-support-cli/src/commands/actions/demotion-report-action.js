const Command = require('../command')
const Result = require('../result')
const ParameterRequiredError = require('../../exceptions/ParameterRequiredError')
const fs = require('fs')

class DemotionReportAction extends Command {
  validate () {
    if (!this.params.username) {
      throw new ParameterRequiredError('A valid username is required.')
    }
    if (!this.params.org) {
      throw new ParameterRequiredError('A valid organization name is required.')
    }
    if (!this.params.description) {
      throw new ParameterRequiredError('A valid description is required.')
    }
    if (!this.params.issueNumber) {
      throw new ParameterRequiredError('A valid issueNumber is required.')
    }
    if (!this.params.duration) {
      throw new ParameterRequiredError('A valid duration number is required.')
    }
    if (!this.params.ticket) {
      throw new ParameterRequiredError('A valid ticket number is required.')
    }
    if (!this.params.demotionDate) {
      throw new ParameterRequiredError('A valid demotion date is required.')
    }
    if (!this.params.promotionDate) {
      throw new ParameterRequiredError('A valid promotion date is required.')
    }
    if (!this.params.targetOrg) {
      throw new ParameterRequiredError('A valid targetOrg is required.')
    }
  }

  async execute () {
    try {
      const report = {
        user: this.params.username,
        targetOrg: this.params.targetOrg,
        description: this.params.description,
        issueNumber: this.params.issueNumber,
        duration: this.params.duration,
        ticket: this.params.ticket,
        demotionDate: this.params.demotionDate,
        promotionDate: this.params.promotionDate,
        auditLogTrail: []
      }

      for await (const request of this.api.v3.paginate.iterator('GET /orgs/{org}/audit-log{?include,per_page,phrase}', {
        org: this.params.targetOrg,
        include: 'all',
        per_page: 100,
        phrase: `created:>=${report.promotionDate} created:<=${report.demotionDate} `
      })) {
        // Filter only the events that happened from the moment the issue was opened to the present
        const data = request.data
        const filteredLog = data.filter((logEntry) => {
          const isTargetUser = logEntry.user === report.user
          const isTriggeringUser = logEntry.actor === report.user
          return isTargetUser || isTriggeringUser
        })
        report.auditLogTrail = report.auditLogTrail.concat(filteredLog)
      }
      // Write file into disk. Commit happens in a different action
      const fileLocation = `${process.cwd()}/${this.params.reportPath}/${this.params.issueNumber}_${this.params.username}.json`
      fs.writeFileSync(fileLocation, JSON.stringify(report, null, 2))
      // Outcome
      return new Result('success')
    } catch (e) {
      console.error('Request failed:', e.request)
      console.error(e.message)
      console.error(e.data)
      throw e
    }
  }

  static getName () {
    return 'demotion_report'
  }
}

module.exports = DemotionReportAction

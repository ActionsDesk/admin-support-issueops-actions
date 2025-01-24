import * as core from '@actions/core'
import * as github from '@actions/github'
import type { GitHub } from '@actions/github/lib/utils.js'
import fs from 'fs'
import path from 'path'
import { ParameterRequiredError } from '../../exceptions/ParameterRequiredError.js'
import { getInputs } from '../../inputs.js'
import type { AuditLogEntry, Inputs, Result } from '../../types.js'
import { Command } from '../command.js'

export class DemotionReportAction implements Command {
  api: InstanceType<typeof GitHub>
  params: Inputs

  constructor() {
    this.params = getInputs()
    this.api = github.getOctokit(this.params.adminToken)
  }

  async validate() {
    if (!this.params.demotionDate)
      throw new ParameterRequiredError('A valid demotion date is required.')
    if (!this.params.issueNumber)
      throw new ParameterRequiredError('A valid issueNumber is required.')
    if (!this.params.parsedIssue)
      throw new ParameterRequiredError('A valid issue is required.')
    if (!this.params.promotionDate)
      throw new ParameterRequiredError('A valid promotion date is required.')
    if (!this.params.reportPath)
      throw new ParameterRequiredError('A valid report path is required.')
    if (!this.params.username)
      throw new ParameterRequiredError('A valid username is required.')

    if (!this.params.allowedOrgs.includes(this.params.parsedIssue.organization))
      throw new Error(
        `Organization ${this.params.parsedIssue.organization} is not allowed`
      )
  }

  async execute(): Promise<Result> {
    try {
      const report = {
        user: this.params.username,
        targetOrg: this.params.parsedIssue!.organization,
        description: this.params.parsedIssue!.description,
        issueNumber: this.params.issueNumber,
        duration: this.params.parsedIssue!.duration,
        ticket: this.params.parsedIssue!.ticket || '',
        demotionDate: this.params.demotionDate,
        promotionDate: this.params.promotionDate,
        auditLogTrail: [] as AuditLogEntry[]
      }

      // Filter only the events that happened from the moment the issue was
      // opened to the present
      const result = (await this.api.paginate(
        'GET /orgs/{org}/audit-log{?include,phrase}',
        {
          org: this.params.parsedIssue!.organization,
          include: 'all',
          phrase: `created:>=${this.params.demotionDate!.toISOString().split('T')[0]} created:<=${this.params.demotionDate!.toISOString().split('T')[0]}`
        }
      )) as AuditLogEntry[]

      report.auditLogTrail = report.auditLogTrail.concat(
        result.filter(
          (item) => item.user === report.user || item.actor === report.user
        )
      )

      // Create the directory if it does not exist
      if (
        !fs.existsSync(
          path.resolve(process.env.GITHUB_WORKSPACE!, this.params.reportPath!)
        )
      )
        fs.mkdirSync(
          path.resolve(process.env.GITHUB_WORKSPACE!, this.params.reportPath!),
          { recursive: true }
        )

      const fileLocation = path.resolve(
        process.env.GITHUB_WORKSPACE!,
        this.params.reportPath!,
        `${this.params.issueNumber}_${this.params.username}.json`
      )
      fs.writeFileSync(fileLocation, JSON.stringify(report, null, 2))

      return {
        status: 'success',
        output: fileLocation
      }
    } catch (error: any) {
      core.error('Request Failed:', error.request)
      core.error(error.message)
      core.error(error.data)

      core.setFailed(error.message)
      return {
        status: 'error',
        output: error.message
      }
    }
  }
}

import * as core from '@actions/core'
import * as github from '@actions/github'
import type { GitHub } from '@actions/github/lib/utils.js'
import { parseIssue } from '@github/issue-parser'
import { getInputs } from '../../inputs.js'
import type { Inputs, Result } from '../../types.js'
import { Command } from '../command.js'

const HOUR_IN_MILLIS = 60 * 60 * 1000

export class CheckAutoDemotionAction implements Command {
  api: InstanceType<typeof GitHub>
  params: Inputs

  constructor() {
    this.params = getInputs()
    this.api = github.getOctokit(this.params.adminToken)
  }

  async validate() {
    core.info('No validation needed.')
  }

  async execute(): Promise<Result> {
    const listOfIssues = await this.api.paginate(
      this.api.rest.issues.listForRepo,
      {
        owner: github.context.repo.owner,
        repo: github.context.repo.repo,
        state: 'open',
        labels: 'user-promoted'
      }
    )

    for (const issue of listOfIssues) {
      const parsedIssue = parseIssue(issue.body!)

      const issueDuration = parseInt(parsedIssue.duration as string)
      const promotedTime = Date.parse(issue.created_at)
      const passedTime = Date.now() - promotedTime

      if (passedTime > issueDuration * HOUR_IN_MILLIS) {
        core.info(`Issue ${issue.number} has passed the duration.`)

        await this.api.rest.issues.update({
          owner: github.context.repo.owner,
          repo: github.context.repo.repo,
          issue_number: issue.number,
          state: 'closed'
        })
      }
    }

    return {
      status: 'success',
      output: 'All issues have been checked.'
    }
  }
}

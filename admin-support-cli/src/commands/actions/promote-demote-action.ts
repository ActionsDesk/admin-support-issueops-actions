import * as github from '@actions/github'
import type { GitHub } from '@actions/github/lib/utils.js'
import { dedent } from 'ts-dedent'
import { ParameterRequiredError } from '../../exceptions/ParameterRequiredError.js'
import { getInputs } from '../../inputs.js'
import type { Inputs, Result } from '../../types.js'
import { Command } from '../command.js'

export class PromoteDemoteAction implements Command {
  api: InstanceType<typeof GitHub>
  params: Inputs

  constructor() {
    this.params = getInputs()
    this.api = github.getOctokit(this.params.adminToken)
  }

  async validate(): Promise<void> {
    if (!this.params.parsedIssue)
      throw new ParameterRequiredError('A valid issue is required.')
    if (!this.params.username)
      throw new ParameterRequiredError('A valid username is required.')
    if (!this.params.role)
      throw new ParameterRequiredError('A valid role is required.')

    if (!this.params.allowedOrgs.includes(this.params.parsedIssue.organization))
      throw new Error(
        `Organization ${this.params.parsedIssue.organization} is not allowed`
      )
  }

  async execute(): Promise<Result> {
    try {
      await this.api.rest.orgs.setMembershipForUser({
        org: this.params.parsedIssue!.organization,
        username: this.params.username!,
        role: this.params.role!
      })

      return {
        status: 'success',
        output: `The role of ${this.params.username} has been successfully changed to: ${this.params.role} in ${this.params.parsedIssue!.organization}`
      }
    } catch (error: any) {
      console.error(
        `Failed to change the role of ${this.params.username} in ${this.params.parsedIssue!.organization}`
      )
      console.error(`Status Code: ${error.status}`)
      console.error(dedent`Possible reasons:

      - Username is not a member of the organization
      - Personal access token provided does not have sufficient privileges
      - Organization does not exist
      - You do not have admin privileges for the organization provided`)

      return {
        status: 'error',
        output: error.message
      }
    }
  }
}

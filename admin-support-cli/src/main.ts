import * as core from '@actions/core'
import * as github from '@actions/github'
import { dedent } from 'ts-dedent'
import { CheckAutoDemotionAction } from './commands/actions/check-auto-demotion-action.js'
import { DemotionReportAction } from './commands/actions/demotion-report-action.js'
import { PromoteDemoteAction } from './commands/actions/promote-demote-action.js'
import type { Command } from './commands/command.js'
import { Action } from './enums.js'
import { CommandDoesNotExistError } from './exceptions/CommandDoesNotExistError.js'
import { getInputs } from './inputs.js'

export async function run() {
  if (!github.context.payload.issue) return core.setFailed('No issue found!')

  const inputs = getInputs()

  try {
    console.log(`Params: ${JSON.stringify(inputs)}`)

    let commandInstance: Command | undefined
    switch (inputs.action) {
      case Action.CHECK_AUTO_DEMOTION:
        commandInstance = new CheckAutoDemotionAction()
        break
      case Action.DEMOTION_REPORT:
        commandInstance = new DemotionReportAction()
        break
      case Action.PROMOTE_DEMOTE:
        commandInstance = new PromoteDemoteAction()
        break
      default:
        throw new CommandDoesNotExistError(inputs.action)
    }

    await commandInstance.validate()
    const result = await commandInstance.execute()

    core.setOutput('output', result.output)
  } catch (error: any) {
    core.error(error)

    // Report the error in a comment
    const octokit = github.getOctokit(inputs.adminToken)
    await octokit.rest.issues.createComment({
      owner: github.context.repo.owner,
      repo: github.context.repo.repo,
      issue_number: github.context.payload.issue.number,
      body: dedent`### :exclamation: An Error Occurred :exclamation:

      ${error.message}

      <sub>
      Details: <a href="https://github.com/${github.context.repo.owner}/${github.context.repo.repo}/actions/runs/${core.getInput('run_id')}">here</a>.
      </sub>
      `
    })

    core.debug(`Exit Code: ${process.exitCode}`)
    return core.setFailed('An error occurred running the command!')
  }
}

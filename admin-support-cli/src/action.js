const core = require('@actions/core')
const github = require('@actions/github')
const executor = require('./commands/executor')
const config = require('./utils/config')

async function run () {
  const params = {
    action: core.getInput('action', {
      required: true
    }),
    adminToken: core.getInput('admin_token', {
      required: true
    }),
    run_id: core.getInput('run_id', {
      required: true
    }),
    issueNumber: core.getInput('issue_number'),
    username: core.getInput('username'),
    targetOrg: core.getInput('target_org'),
    role: core.getInput('role'),
    duration: core.getInput('duration'),
    ticket: core.getInput('ticket'),
    description: core.getInput('description'),
    promotionDate: core.getInput('promotion_date'),
    demotionDate: core.getInput('demotion_date')
  }
  try {
    await executor({ ...config(), ...params, outputFunction: core.setOutput })
  } catch (e) {
    core.error(e)
    // Report the error in a comment
    const context = github.context
    if (context.payload.issue == null) {
      core.setFailed(e.toString())
      return
    }
    const octokit = github.getOctokit(params.adminToken)
    await octokit.issues.createComment({
      ...context.repo,
      issue_number: context.payload.issue.number,
      body: `⚠️⚠️ Error: ${e}
      
<sub>
  Find details of the automation <a href="https://github.com/${context.repo.owner}/${context.repo.repo}/actions/runs/${core.getInput('run_id')}">here</a>.
</sub>
      `
    })
    core.setFailed(`Error executing the command. ${e}`)
    core.debug(`Exit code: ${process.exitCode}`)
  }
}

run()

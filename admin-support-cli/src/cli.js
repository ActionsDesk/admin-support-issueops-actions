const { program } = require('commander')
const executor = require('./commands/executor')
const ParameterRequiredError = require('./exceptions/ParameterRequiredError')
const CommandDoesNotExistError = require('./exceptions/CommandDoesNotExistError')
const config = require('./utils/config')

program.version('1.0.0', '-v, --version', 'Output the current version')
  .option('-t, --admin-token <string>', 'the token to access the API (mandatory)')
  .option('-a, --action <string>', 'the action to be executed')
  .option(' ')
  .option('action: parse_issue', 'Parse the body of an issue')
  .option('-i, --issue-number <number>', 'the issue number where we are executing the operation')
  .option(' ')
  .option('action: promote_demote', 'Promote user to admin or demote to member')
  .option('-u, --username <string>', 'the username to promote/demote')
  .option('-r, --role <string>', 'the role to apply on the username [admin | member]')
  .option('-o, --target-org <string>', 'the target organization where the user will be promoted')
  .option(' ')
  .option('action: demotion_report', 'Parse the body of an issue')
  .option('-u, --username <string>', 'the username that was promoted/demoted')
  .option('-d, --description <string>', 'activity description')
  .option('-i, --issue-number <number>', 'the issue number where we are executing the operation')
  .option('-du, --duration <number>', 'the duration requested for this operation')
  .option('-s, --ticket <number>', 'the ticket number')
  .option('-dd, --demotion-date <date>', 'demotion date example: 2021-03-12T10:36:36+00:00')
  .option('-pd, --promotion-date <date>', 'promotion date example: 2021-03-12T09:36:36+00:00')
  .option(' ')

program.parse(process.argv)

const outputFunction = (key, val) => console.log(`${key}: ${val}`)

executor({ ...program.opts(), ...config(), outputFunction })
  .catch(err => {
    if (err instanceof ParameterRequiredError) {
      console.log(program.helpInformation())
      console.error(`ERROR: ${err.message}`)
    } else if (err instanceof CommandDoesNotExistError) {
      console.error(`ERROR: ${err.message}`)
    } else {
      console.error(err)
    }
  })

const Result = require('./result')
const ParameterRequiredError = require('../exceptions/ParameterRequiredError')
const CommandDoesNotExistError = require('../exceptions/CommandDoesNotExistError')
const commands = require('./actions')
const { buildV3Octokit, buildV4Octokit } = require('../utils/api-builder')

const executor = async function (params) {
  if (!params.action) {
    throw new ParameterRequiredError('An action parameter is required.')
  }
  if (!params.adminToken) {
    throw new ParameterRequiredError('An adminToken parameter is required.')
  }

  // Build octokit
  const api = {
    v3: buildV3Octokit(params.adminToken),
    v4: buildV4Octokit(params.adminToken)
  }
  console.log(`Params: ${JSON.stringify(params)}`)

  // Commands are also passed as objects to the commands in case we want to execute another command from the previous one
  const reducedCommands = {}
  commands.reduce((acc, command) => {
    acc[command.getName()] = command
    return acc
  }, reducedCommands)

  // Select the command we want to execute
  const SelectedCommand = reducedCommands[params.action]
  if (SelectedCommand === undefined) {
    throw new CommandDoesNotExistError(`${params.action} is not a valid action.`)
  }

  // Execute the command
  const commandInstance = new SelectedCommand(api, params)
  await commandInstance.validate()
  const result = await commandInstance.execute()

  // Output results from execution
  if (result && result instanceof Result && result.output) {
    console.log(`Set output: ${JSON.stringify(result.output)}`)
    params.outputFunction('output', result.output)
  }
}

module.exports = executor

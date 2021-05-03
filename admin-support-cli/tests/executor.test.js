const {
  githubInstrumentation,
  githubInstrumentationTeardown,
  replyGithubGetResponse
} = require('./instrumentation/github-instrumentation')
const CommandDoesNotExistError = require('../src/exceptions/CommandDoesNotExistError')
const ParameterRequiredError = require('../src/exceptions/ParameterRequiredError')
const ParseIssueAction = require('../src/commands/actions/parse-issue-action')
const issueOpened = require('./fixtures/mock/issue-opened')
const executor = require('../src/commands/executor')

describe('Executor', () => {
  beforeEach(() => {
    githubInstrumentation()
  })

  afterEach(() => {
    githubInstrumentationTeardown()
  })

  describe('method: execute()', () => {
    test('execute() - ParameterRequiredError - Validate if action is not provided', async () => {
      try {
        await executor({
          adminToken: '123456'
        })
      } catch (error) {
        expect(error).toBeInstanceOf(ParameterRequiredError)
        expect(error).toHaveProperty('message', 'An action parameter is required.')
      }
    })

    test('execute() - ParameterRequiredError - Validate thifat adminToken is not provided', async () => {
      try {
        await executor({
          action: 'test'
        })
      } catch (error) {
        expect(error).toBeInstanceOf(ParameterRequiredError)
        expect(error).toHaveProperty('message', 'An adminToken parameter is required.')
      }
    })

    test('execute() - CommandDoesNotExistError - The action provided is not linked to other action', async () => {
      try {
        await executor({
          action: 'test',
          adminToken: '123456'
        })
      } catch (error) {
        expect(error).toBeInstanceOf(CommandDoesNotExistError)
        expect(error).toHaveProperty('message', 'test is not a valid action.')
      }
    })

    test('execute() - Action gets executed and output is provided in outputFunction', async () => {
      const mockCallback = jest.fn()
      const issueOpenedMock = JSON.parse(JSON.stringify(issueOpened))
      issueOpenedMock.body = `
      Organization: test
      Description: This is a description
      Ticket: 1
      Duration: 1
      `
      replyGithubGetResponse('/repos/test/test/issues/1', null, issueOpenedMock)

      await executor({
        action: ParseIssueAction.getName(),
        adminToken: '123456',
        org: 'test',
        repository: 'test',
        supportedOrgs: ['test'],
        issueNumber: 1,
        outputFunction: (key, value) => {
          mockCallback()
          expect(key).toBe('output')
          expect(JSON.parse(value)).toMatchObject({
            target_org: 'test',
            description: 'This is a description',
            ticket: '1',
            duration: 1
          })
        }
      })

      expect(mockCallback).toBeCalled()
      expect.assertions(3)
    })
  })
})

const {
  githubInstrumentation,
  githubInstrumentationTeardown,
  replyGithubGetResponse,
  replyGithubPatchResponse,
  mockApis
} = require('./instrumentation/github-instrumentation')
const CheckAutoDemotionAction = require('../src/commands/actions/check-auto-demotion-action')
const ParameterRequiredError = require('../src/exceptions/ParameterRequiredError')
const issueOpened = require('./fixtures/mock/issue-opened')

describe('Check auto demotion', () => {
  beforeEach(() => {
    githubInstrumentation()
  })

  afterEach(() => {
    githubInstrumentationTeardown()
  })

  describe('method: validate()', () => {
    test('validate() - all valid parameters does not throw an exception', () => {
      const apis = mockApis()
      const mockParams = {
        org: 'test',
        repository: 'test'
      }
      const action = new CheckAutoDemotionAction(apis, mockParams)
      expect(() => action.validate).not.toThrow(ParameterRequiredError)
    })

    test('validate() - ParameterRequiredError exception - missing org', async () => {
      const apis = mockApis()
      const mockParams = {
        repository: 'test',
        supportedOrgs: ['test'],
        issueNumber: 1
      }
      const action = new CheckAutoDemotionAction(apis, mockParams)
      try {
        await action.validate()
      } catch (error) {
        expect(error).toBeInstanceOf(ParameterRequiredError)
        expect(error).toHaveProperty('message', 'A valid organization name is required.')
      }
      expect.assertions(2)
    })

    test('validate() - ParameterRequiredError exception - missing repository', async () => {
      const apis = mockApis()
      const mockParams = {
        org: 'test',
        supportedOrgs: ['test'],
        issueNumber: 1
      }
      const action = new CheckAutoDemotionAction(apis, mockParams)
      try {
        await action.validate()
      } catch (error) {
        expect(error).toBeInstanceOf(ParameterRequiredError)
        expect(error).toHaveProperty('message', 'A valid repository name is required.')
      }
      expect.assertions(2)
    })
  })

  describe('method: execute()', () => {
    test('execute() - Empty list of issues', async () => {
      const apis = mockApis()
      const mockParams = {
        org: 'test',
        repository: 'test',
        supportedOrgs: ['test'],
        issueNumber: 1
      }
      replyGithubGetResponse('/repos/test/test/issues', {
        state: 'open',
        labels: 'user-promoted'
      }, [])
      const action = new CheckAutoDemotionAction(apis, mockParams)
      const result = await action.execute()
      expect(result.status).toBe('success')
    })

    test('execute() - Issue gets closed if duration was longer than the current time passed', async () => {
      const apis = mockApis()
      const mockParams = {
        org: 'test',
        repository: 'test',
        supportedOrgs: ['test']
      }
      const issueOpenedMock = JSON.parse(JSON.stringify(issueOpened))
      issueOpenedMock.body = `
      Organization: test
      Description: This is a description
      Ticket: 1
      Duration: 1
      `
      replyGithubGetResponse('/repos/test/test/issues', {
        state: 'open',
        labels: 'user-promoted'
      }, [issueOpenedMock])

      replyGithubGetResponse('/repos/test/test/issues/1', null, issueOpenedMock)
      replyGithubPatchResponse('/repos/test/test/issues/1', (_, req) => {
        expect(req.state).toBe('closed')
        return { ...issueOpenedMock, status: 'closed' }
      })
      const action = new CheckAutoDemotionAction(apis, mockParams)
      const result = await action.execute()
      expect(result.status).toBe('success')
      expect.assertions(2)
    })

    test('execute() - Issue is not closed if the duration is smaller than the current time passed', async () => {
      const apis = mockApis()
      const mockParams = {
        org: 'test',
        repository: 'test',
        supportedOrgs: ['test']
      }
      const issueOpenedMock = JSON.parse(JSON.stringify(issueOpened))
      issueOpenedMock.body = `
      Organization: test
      Description: This is a description
      Ticket: 1
      Duration: 1
      `
      // Override the date
      issueOpenedMock.created_at = new Date().toISOString()
      replyGithubGetResponse('/repos/test/test/issues', {
        state: 'open',
        labels: 'user-promoted'
      }, [issueOpenedMock])

      replyGithubGetResponse('/repos/test/test/issues/1', null, issueOpenedMock)
      const notMockFunctionCall = jest.fn()
      replyGithubPatchResponse('/repos/test/test/issues/1', notMockFunctionCall)
      const action = new CheckAutoDemotionAction(apis, mockParams)
      const result = await action.execute()
      expect(result.status).toBe('success')
      expect(notMockFunctionCall).not.toHaveBeenCalled()
      expect.assertions(2)
    })
  })
})

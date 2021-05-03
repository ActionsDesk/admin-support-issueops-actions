const {
  githubInstrumentation,
  githubInstrumentationTeardown,
  replyGithubGetResponse,
  mockApis
} = require('./instrumentation/github-instrumentation')
const ParseIssueAction = require('../src/commands/actions/parse-issue-action')
const ParameterRequiredError = require('../src/exceptions/ParameterRequiredError')
const ParameterValidationError = require('../src/exceptions/ParameterValidationError')
const issueOpened = require('./fixtures/mock/issue-opened')

describe('Parse issue', () => {
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
        repository: 'test',
        supportedOrgs: ['test'],
        issueNumber: 1
      }
      const action = new ParseIssueAction(apis, mockParams)
      expect(() => action.validate).not.toThrow(ParameterRequiredError)
    })

    test('validate() - ParameterRequiredError exception - missing org', async () => {
      const apis = mockApis()
      const mockParams = {
        repository: 'test',
        supportedOrgs: ['test'],
        issueNumber: 1
      }
      const action = new ParseIssueAction(apis, mockParams)
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
      const action = new ParseIssueAction(apis, mockParams)
      try {
        await action.validate()
      } catch (error) {
        expect(error).toBeInstanceOf(ParameterRequiredError)
        expect(error).toHaveProperty('message', 'A valid repository name is required.')
      }
      expect.assertions(2)
    })

    test('validate() - ParameterRequiredError exception - missing issueNumber', async () => {
      const apis = mockApis()
      const mockParams = {
        org: 'test',
        repository: 'test',
        supportedOrgs: ['test']
      }
      const action = new ParseIssueAction(apis, mockParams)
      try {
        await action.validate()
      } catch (error) {
        expect(error).toBeInstanceOf(ParameterRequiredError)
        expect(error).toHaveProperty('message', 'A valid repository issue number is required.')
      }
      expect.assertions(2)
    })

    test('validate() - ParameterRequiredError exception - missing supportedOrgs', async () => {
      const apis = mockApis()
      const mockParams = {
        org: 'test',
        repository: 'test',
        issueNumber: 1
      }
      const action = new ParseIssueAction(apis, mockParams)
      try {
        await action.validate()
      } catch (error) {
        expect(error).toBeInstanceOf(ParameterRequiredError)
        expect(error).toHaveProperty('message', 'Missing supportedOrgs in the configuration.')
      }
      expect.assertions(2)
    })
  })

  describe('method: getName()', () => {
    test('getName() - returns action name', () => {
      expect(ParseIssueAction.getName()).toEqual('parse_issue')
    })
  })

  describe('method: execute()', () => {
    test('execute() - ParameterValidationError exception - missing description', async () => {
      const apis = mockApis()
      const mockParams = {
        org: 'test',
        repository: 'test',
        supportedOrgs: ['test'],
        issueNumber: 1
      }
      const issueOpenedMock = JSON.parse(JSON.stringify(issueOpened))
      issueOpenedMock.body = `
      Organization: test 
      Ticket: 1
      Duration: 1
      `
      replyGithubGetResponse('/repos/test/test/issues/1', null, issueOpenedMock)

      const action = new ParseIssueAction(apis, mockParams)
      try {
        await action.execute()
      } catch (error) {
        expect(error).toBeInstanceOf(ParameterValidationError)
        expect(error).toHaveProperty('message', JSON.stringify({ description: ["Description can't be blank"] }))
      }
      expect.assertions(2)
    })

    test('execute() - ParameterValidationError exception - missing in targetOrg', async () => {
      const apis = mockApis()
      const mockParams = {
        org: 'test',
        repository: 'test',
        supportedOrgs: ['test'],
        issueNumber: 1
      }
      const issueOpenedMock = JSON.parse(JSON.stringify(issueOpened))
      issueOpenedMock.body = `
      Organization: test2
      Description: This is a description
      Ticket: 1
      Duration: 1
      `
      replyGithubGetResponse('/repos/test/test/issues/1', null, issueOpenedMock)

      const action = new ParseIssueAction(apis, mockParams)
      try {
        await action.execute()
      } catch (error) {
        expect(error).toBeInstanceOf(ParameterValidationError)
        expect(error).toHaveProperty('message', JSON.stringify({ target_org: ['test2 is not included in the list'] }))
      }
      expect.assertions(2)
    })

    test('execute() - ParameterValidationError exception - missing ticket', async () => {
      const apis = mockApis()
      const mockParams = {
        org: 'test',
        repository: 'test',
        supportedOrgs: ['test'],
        issueNumber: 1
      }
      const issueOpenedMock = JSON.parse(JSON.stringify(issueOpened))
      issueOpenedMock.body = `
      Organization: test
      Description: This is a description
      Duration: 1
      `
      replyGithubGetResponse('/repos/test/test/issues/1', null, issueOpenedMock)

      const action = new ParseIssueAction(apis, mockParams)
      try {
        await action.execute()
      } catch (error) {
        expect(error).toBeInstanceOf(ParameterValidationError)
        expect(error).toHaveProperty('message', JSON.stringify({ ticket: ["Ticket can't be blank"] }))
      }
      expect.assertions(2)
    })

    test('execute() - ParameterValidationError exception - missing duration', async () => {
      const apis = mockApis()
      const mockParams = {
        org: 'test',
        repository: 'test',
        supportedOrgs: ['test'],
        issueNumber: 1
      }
      const issueOpenedMock = JSON.parse(JSON.stringify(issueOpened))
      issueOpenedMock.body = `
      Organization: test
      Description: This is a description
      Ticket: 1
      `
      replyGithubGetResponse('/repos/test/test/issues/1', null, issueOpenedMock)

      const action = new ParseIssueAction(apis, mockParams)
      try {
        await action.execute()
      } catch (error) {
        expect(error).toBeInstanceOf(ParameterValidationError)
        expect(error).toHaveProperty('message', JSON.stringify({ duration: ["Duration can't be blank"] }))
      }
      expect.assertions(2)
    })

    test('execute() - ParameterValidationError exception - duration lower or equal to 0', async () => {
      const apis = mockApis()
      const mockParams = {
        org: 'test',
        repository: 'test',
        supportedOrgs: ['test'],
        issueNumber: 1
      }
      const issueOpenedMock = JSON.parse(JSON.stringify(issueOpened))
      issueOpenedMock.body = `
      Organization: test
      Description: This is a description
      Ticket: 1
      Duration: 0
      `
      replyGithubGetResponse('/repos/test/test/issues/1', null, issueOpenedMock)

      const action = new ParseIssueAction(apis, mockParams)
      try {
        await action.execute()
      } catch (error) {
        expect(error).toBeInstanceOf(ParameterValidationError)
        expect(error).toHaveProperty('message', JSON.stringify({ duration: ['Duration must be greater than 0'] }))
      }
      expect.assertions(2)
    })

    test('execute() - ParameterValidationError exception - duration greater than 8', async () => {
      const apis = mockApis()
      const mockParams = {
        org: 'test',
        repository: 'test',
        supportedOrgs: ['test'],
        issueNumber: 1
      }
      const issueOpenedMock = JSON.parse(JSON.stringify(issueOpened))
      issueOpenedMock.body = `
      Organization: test
      Description: This is a description
      Ticket: 1
      Duration: 10
      `
      replyGithubGetResponse('/repos/test/test/issues/1', null, issueOpenedMock)

      const action = new ParseIssueAction(apis, mockParams)
      try {
        await action.execute()
      } catch (error) {
        expect(error).toBeInstanceOf(ParameterValidationError)
        expect(error).toHaveProperty('message', JSON.stringify({ duration: ['Duration must be less than or equal to 8'] }))
      }
      expect.assertions(2)
    })

    test('execute() - Parsed values obtained', async () => {
      const apis = mockApis()
      const mockParams = {
        org: 'test',
        repository: 'test',
        supportedOrgs: ['test'],
        issueNumber: 1
      }
      const issueOpenedMock = JSON.parse(JSON.stringify(issueOpened))
      issueOpenedMock.body = `
      Organization: test
      Description: This is a description
      Ticket: 1
      Duration: 3
      `
      replyGithubGetResponse('/repos/test/test/issues/1', null, issueOpenedMock)

      const action = new ParseIssueAction(apis, mockParams)
      const result = await action.execute()
      expect(JSON.parse(result.output)).toMatchObject({
        target_org: 'test',
        description: 'This is a description',
        ticket: '1',
        duration: 3
      })
      expect(result.status).toBe('success')
    })
  })
})

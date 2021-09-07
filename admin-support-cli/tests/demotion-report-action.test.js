const {
  githubInstrumentation,
  githubInstrumentationTeardown,
  replyGithubGetResponse,
  mockApis
} = require('./instrumentation/github-instrumentation')
const DemotionReportAction = require('../src/commands/actions/demotion-report-action')
const ParameterRequiredError = require('../src/exceptions/ParameterRequiredError')
const demotionAuditLog = require('./fixtures/mock/audit-log-trail')
const fs = require('fs')
const path = require('path')

describe('Demotion report', () => {
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
        username: 'droidpl',
        org: 'test',
        description: 'This is a test description',
        issueNumber: 1,
        duration: 1,
        ticket: '1234',
        demotionDate: new Date(),
        promotionDate: new Date(Date.now() - 24 * 60 * 60),
        targetOrg: 'test'
      }
      const action = new DemotionReportAction(apis, mockParams)
      expect(() => action.validate).not.toThrow(ParameterRequiredError)
    })

    test('validate() - ParameterRequiredError exception - missing username', async () => {
      const apis = mockApis()
      const mockParams = {
        org: 'test',
        description: 'This is a test description',
        issueNumber: 1,
        duration: 1,
        ticket: '1234',
        demotionDate: new Date(),
        promotionDate: new Date(Date.now() - 24 * 60 * 60),
        targetOrg: 'test'
      }
      const action = new DemotionReportAction(apis, mockParams)
      try {
        await action.validate()
      } catch (error) {
        expect(error).toBeInstanceOf(ParameterRequiredError)
        expect(error).toHaveProperty('message', 'A valid username is required.')
      }
      expect.assertions(2)
    })

    test('validate() - ParameterRequiredError exception - missing org', async () => {
      const apis = mockApis()
      const mockParams = {
        username: 'droidpl',
        description: 'This is a test description',
        issueNumber: 1,
        duration: 1,
        ticket: '1234',
        demotionDate: new Date(),
        promotionDate: new Date(Date.now() - 24 * 60 * 60),
        targetOrg: 'test'
      }
      const action = new DemotionReportAction(apis, mockParams)
      try {
        await action.validate()
      } catch (error) {
        expect(error).toBeInstanceOf(ParameterRequiredError)
        expect(error).toHaveProperty('message', 'A valid organization name is required.')
      }
      expect.assertions(2)
    })

    test('validate() - ParameterRequiredError exception - missing description', async () => {
      const apis = mockApis()
      const mockParams = {
        username: 'droidpl',
        org: 'test',
        issueNumber: 1,
        duration: 1,
        ticket: '1234',
        demotionDate: new Date(),
        promotionDate: new Date(Date.now() - 24 * 60 * 60),
        targetOrg: 'test'
      }
      const action = new DemotionReportAction(apis, mockParams)
      try {
        await action.validate()
      } catch (error) {
        expect(error).toBeInstanceOf(ParameterRequiredError)
        expect(error).toHaveProperty('message', 'A valid description is required.')
      }
      expect.assertions(2)
    })

    test('validate() - ParameterRequiredError exception - missing issue number', async () => {
      const apis = mockApis()
      const mockParams = {
        username: 'droidpl',
        org: 'test',
        description: 'This is a test description',
        duration: 1,
        ticket: '1234',
        demotionDate: new Date(),
        promotionDate: new Date(Date.now() - 24 * 60 * 60),
        targetOrg: 'test'
      }
      const action = new DemotionReportAction(apis, mockParams)
      try {
        await action.validate()
      } catch (error) {
        expect(error).toBeInstanceOf(ParameterRequiredError)
        expect(error).toHaveProperty('message', 'A valid issueNumber is required.')
      }
      expect.assertions(2)
    })

    test('validate() - ParameterRequiredError exception - missing duration', async () => {
      const apis = mockApis()
      const mockParams = {
        username: 'droidpl',
        org: 'test',
        description: 'This is a test description',
        issueNumber: 1,
        ticket: '1234',
        demotionDate: new Date(),
        promotionDate: new Date(Date.now() - 24 * 60 * 60),
        targetOrg: 'test'
      }
      const action = new DemotionReportAction(apis, mockParams)
      try {
        await action.validate()
      } catch (error) {
        expect(error).toBeInstanceOf(ParameterRequiredError)
        expect(error).toHaveProperty('message', 'A valid duration number is required.')
      }
      expect.assertions(2)
    })

    test('validate() - ParameterRequiredError exception - ticket', async () => {
      const apis = mockApis()
      const mockParams = {
        username: 'droidpl',
        org: 'test',
        description: 'This is a test description',
        issueNumber: 1,
        duration: 1,
        demotionDate: new Date(),
        promotionDate: new Date(Date.now() - 24 * 60 * 60),
        targetOrg: 'test'
      }
      const action = new DemotionReportAction(apis, mockParams)
      try {
        await action.validate()
      } catch (error) {
        expect(error).toBeInstanceOf(ParameterRequiredError)
        expect(error).toHaveProperty('message', 'A valid ticket number is required.')
      }
      expect.assertions(2)
    })

    test('validate() - ParameterRequiredError exception - missing demotion date', async () => {
      const apis = mockApis()
      const mockParams = {
        username: 'droidpl',
        org: 'test',
        description: 'This is a test description',
        issueNumber: 1,
        duration: 1,
        ticket: '1234',
        promotionDate: new Date(Date.now() - 24 * 60 * 60),
        targetOrg: 'test'
      }
      const action = new DemotionReportAction(apis, mockParams)
      try {
        await action.validate()
      } catch (error) {
        expect(error).toBeInstanceOf(ParameterRequiredError)
        expect(error).toHaveProperty('message', 'A valid demotion date is required.')
      }
      expect.assertions(2)
    })

    test('validate() - ParameterRequiredError exception - missing promotion date', async () => {
      const apis = mockApis()
      const mockParams = {
        username: 'droidpl',
        org: 'test',
        description: 'This is a test description',
        issueNumber: 1,
        duration: 1,
        ticket: '1234',
        demotionDate: new Date(),
        targetOrg: 'test'
      }
      const action = new DemotionReportAction(apis, mockParams)
      try {
        await action.validate()
      } catch (error) {
        expect(error).toBeInstanceOf(ParameterRequiredError)
        expect(error).toHaveProperty('message', 'A valid promotion date is required.')
      }
      expect.assertions(2)
    })

    test('validate() - ParameterRequiredError exception - missing org', async () => {
      const apis = mockApis()
      const mockParams = {
        username: 'droidpl',
        org: 'test',
        description: 'This is a test description',
        issueNumber: 1,
        duration: 1,
        ticket: '1234',
        demotionDate: new Date(),
        promotionDate: new Date(Date.now() - 24 * 60 * 60)
      }
      const action = new DemotionReportAction(apis, mockParams)
      try {
        await action.validate()
      } catch (error) {
        expect(error).toBeInstanceOf(ParameterRequiredError)
        expect(error).toHaveProperty('message', 'A valid targetOrg is required.')
      }
      expect.assertions(2)
    })
  })

  describe('method: execute()', () => {
    afterEach(() => {
      try {
        fs.unlinkSync(path.join(__dirname, '/fixtures/1_droidpl.json'))
      } catch (e) {
        // No mater if this the file doesn't exist always
      }
    })
    test('execute() - Check report generated with empty audit log entries', async () => {
      const apis = mockApis()
      const mockParams = {
        username: 'droidpl',
        org: 'test',
        description: 'This is a test description',
        issueNumber: 1,
        duration: 1,
        ticket: '1234',
        demotionDate: new Date(Date.parse('2021-02-08T10:20:00Z')),
        promotionDate: new Date(Date.parse('2021-02-07T10:20:00Z')),
        targetOrg: 'test',
        reportPath: 'tests/fixtures'
      }
      replyGithubGetResponse('/orgs/test/audit-log', {
        include: 'all',
        per_page: 100,
        phrase: `created:>=${mockParams.promotionDate} created:<=${mockParams.demotionDate} `
      }, [])
      const action = new DemotionReportAction(apis, mockParams)
      const result = await action.execute()
      const file = JSON.parse(fs.readFileSync(path.join(__dirname, '/fixtures/1_droidpl.json')))
      expect(file).toMatchObject({
        user: 'droidpl',
        description: 'This is a test description',
        issueNumber: 1,
        duration: 1,
        ticket: '1234',
        demotionDate: '2021-02-08T10:20:00.000Z',
        promotionDate: '2021-02-07T10:20:00.000Z',
        targetOrg: 'test',
        auditLogTrail: []
      })
      expect(file.auditLogTrail).toEqual(expect.arrayContaining([]))
      expect(result.status).toBe('success')
    })

    test('execute() - Check report generated with audit log entries', async () => {
      const mockCallback = jest.fn()
      const apis = mockApis()
      const mockParams = {
        username: 'droidpl',
        org: 'test',
        description: 'This is a test description',
        issueNumber: 1,
        duration: 1,
        ticket: '1234',
        demotionDate: new Date(Date.parse('2021-03-19T11:05:50Z')),
        promotionDate: new Date(Date.parse('2021-03-19T11:08:03Z')),
        targetOrg: 'test',
        reportPath: 'tests/fixtures'
      }
      replyGithubGetResponse('/orgs/test/audit-log', {
        include: 'all',
        per_page: 100,
        phrase: `created:>=${mockParams.promotionDate} created:<=${mockParams.demotionDate} `
      }, () => {
        mockCallback()
        return demotionAuditLog
      })
      const action = new DemotionReportAction(apis, mockParams)
      const result = await action.execute()
      const file = JSON.parse(fs.readFileSync(path.join(__dirname, '/fixtures/1_droidpl.json')))
      expect(file).toMatchObject({
        user: 'droidpl',
        description: 'This is a test description',
        issueNumber: 1,
        duration: 1,
        ticket: '1234',
        demotionDate: '2021-03-19T11:05:50.000Z',
        promotionDate: '2021-03-19T11:08:03.000Z',
        targetOrg: 'test'
      })
      expect(file.auditLogTrail).toEqual(expect.arrayContaining(demotionAuditLog))
      expect(mockCallback).toBeCalled()
      expect(result.status).toBe('success')
    })
  })
})

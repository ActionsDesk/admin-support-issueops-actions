import { jest } from '@jest/globals'
import * as core from '../../../__fixtures__/@actions/core.js'
import * as github from '../../../__fixtures__/@actions/github.js'
import * as octokit from '../../../__fixtures__/@octokit/rest.js'
import * as fs from '../../../__fixtures__/fs.js'
import { getInputsMock } from '../../../__fixtures__/inputs.js'
import { Action } from '../../../src/enums.js'
import type { AuditLogEntry, Inputs } from '../../../src/types.js'

// Mocks should be declared before the module being tested is imported.
jest.unstable_mockModule('@actions/core', () => core)
jest.unstable_mockModule('@actions/github', () => github)
jest.unstable_mockModule('@octokit/rest', async () => {
  class Octokit {
    constructor() {
      return octokit
    }
  }

  return {
    Octokit
  }
})
jest.unstable_mockModule('fs', () => fs)

jest.unstable_mockModule('../../../src/inputs.js', () => ({
  getInputs: getInputsMock
}))

// The module being tested should be imported dynamically. This ensures that the
// mocks are used in place of any actual dependencies.
const { DemotionReportAction } = await import(
  '../../../src/commands/actions/demotion-report-action.js'
)

const { Octokit } = await import('@octokit/rest')
const mocktokit = jest.mocked(new Octokit())

describe('DemotionReportAction', () => {
  beforeEach(() => {
    getInputsMock.mockReset().mockReturnValueOnce({
      action: Action.DEMOTION_REPORT
    } as Inputs)
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('constructor', () => {
    it('Sets the params and api properties', () => {
      const report = new DemotionReportAction()

      expect(report.params).toEqual({
        action: Action.DEMOTION_REPORT
      })
      expect(report.api).toEqual(mocktokit)
    })
  })

  describe('validate', () => {
    it('Fails if no demotion date is provided', async () => {
      getInputsMock.mockReset().mockReturnValueOnce({} as Inputs)

      const report = new DemotionReportAction()

      await expect(report.validate()).rejects.toThrow()
    })

    it('Fails if no issue number is provided', async () => {
      getInputsMock.mockReset().mockReturnValueOnce({
        demotionDate: new Date()
      } as Inputs)

      const report = new DemotionReportAction()

      await expect(report.validate()).rejects.toThrow()
    })

    it('Fails if no parsed issue is provided', async () => {
      getInputsMock.mockReset().mockReturnValueOnce({
        demotionDate: new Date(),
        issueNumber: 1
      } as Inputs)

      const report = new DemotionReportAction()

      await expect(report.validate()).rejects.toThrow()
    })

    it('Fails if no promotion date is provided', async () => {
      getInputsMock.mockReset().mockReturnValueOnce({
        demotionDate: new Date(),
        issueNumber: 1,
        parsedIssue: {}
      } as Inputs)

      const report = new DemotionReportAction()

      await expect(report.validate()).rejects.toThrow()
    })

    it('Fails if no report path is provided', async () => {
      getInputsMock.mockReset().mockReturnValueOnce({
        demotionDate: new Date(),
        issueNumber: 1,
        parsedIssue: {},
        promotionDate: new Date()
      } as Inputs)

      const report = new DemotionReportAction()

      await expect(report.validate()).rejects.toThrow()
    })

    it('Fails if no username is provided', async () => {
      getInputsMock.mockReset().mockReturnValueOnce({
        demotionDate: new Date(),
        issueNumber: 1,
        parsedIssue: {},
        promotionDate: new Date(),
        reportPath: 'reports'
      } as Inputs)

      const report = new DemotionReportAction()

      await expect(report.validate()).rejects.toThrow()
    })

    it('Fails if an invalid org is provided', async () => {
      getInputsMock.mockReset().mockReturnValueOnce({
        demotionDate: new Date(),
        issueNumber: 1,
        parsedIssue: {
          organization: 'invalid'
        },
        promotionDate: new Date(),
        reportPath: 'reports',
        username: 'mona',
        allowedOrgs: ['valid']
      } as Inputs)

      const report = new DemotionReportAction()

      await expect(report.validate()).rejects.toThrow()
    })
  })

  describe('execute', () => {
    beforeEach(() => {
      process.env.GITHUB_WORKSPACE = '/path/to/workspace'
    })

    it('Processes the report', async () => {
      fs.existsSync.mockImplementation(() => false)
      getInputsMock.mockReset().mockReturnValueOnce({
        demotionDate: new Date(),
        issueNumber: 1,
        parsedIssue: {
          organization: 'valid'
        },
        promotionDate: new Date(),
        reportPath: 'reports',
        username: 'mona',
        allowedOrgs: ['valid']
      } as Inputs)

      mocktokit.paginate.mockResolvedValue([
        {
          user: 'mona',
          actor: 'mona'
        } as AuditLogEntry
      ])

      const report = new DemotionReportAction()

      await report.execute()

      expect(fs.mkdirSync).toHaveBeenCalled()
      expect(fs.writeFileSync).toHaveBeenCalled()
    })

    it('Processes a failure', async () => {
      fs.existsSync.mockRejectedValue({} as never)
      getInputsMock.mockReset().mockReturnValueOnce({
        demotionDate: new Date(),
        issueNumber: 1,
        parsedIssue: {
          organization: 'valid'
        },
        promotionDate: new Date(),
        reportPath: 'reports',
        username: 'mona',
        allowedOrgs: ['valid']
      } as Inputs)

      mocktokit.paginate.mockRejectedValue({
        message: 'An error occurred'
      })

      const report = new DemotionReportAction()

      await report.execute()

      expect(core.setFailed).toHaveBeenCalled()
    })
  })
})

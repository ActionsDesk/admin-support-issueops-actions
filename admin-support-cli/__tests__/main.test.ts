import { jest } from '@jest/globals'
import * as core from '../__fixtures__/@actions/core.js'
import * as github from '../__fixtures__/@actions/github.js'
import * as octokit from '../__fixtures__/@octokit/rest.js'
import * as check from '../__fixtures__/commands/actions/check-auto-demotion-action.js'
import * as report from '../__fixtures__/commands/actions/demotion-report-action.js'
import * as promote from '../__fixtures__/commands/actions/promote-demote-action.js'
import { getInputsMock } from '../__fixtures__/inputs.js'
import { Action } from '../src/enums.js'
import type { Inputs } from '../src/types.js'

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

jest.unstable_mockModule('../src/inputs.js', () => ({
  getInputs: getInputsMock
}))
jest.unstable_mockModule(
  '../src/commands/actions/check-auto-demotion-action.js',
  () => ({
    CheckAutoDemotionAction: check.CheckAutoDemotionAction
  })
)
jest.unstable_mockModule(
  '../src/commands/actions/demotion-report-action.js',
  () => ({
    DemotionReportAction: report.DemotionReportAction
  })
)
jest.unstable_mockModule(
  '../src/commands/actions/promote-demote-action.js',
  () => ({
    PromoteDemoteAction: promote.PromoteDemoteAction
  })
)

// The module being tested should be imported dynamically. This ensures that the
// mocks are used in place of any actual dependencies.
const { run } = await import('../src/main.js')

const { Octokit } = await import('@octokit/rest')
const mocktokit = jest.mocked(new Octokit())

describe('main.ts', () => {
  beforeEach(() => {
    check.execute.mockResolvedValue({
      status: 'success',
      output: 'test'
    } as never)

    report.execute.mockResolvedValue({
      status: 'success',
      output: 'test'
    } as never)

    promote.execute.mockResolvedValue({
      status: 'success',
      output: 'test'
    } as never)
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('Fails if an invalid command is provided', async () => {
    getInputsMock.mockReset().mockReturnValueOnce({
      action: 'invalid'
    } as Inputs)

    await run()

    expect(mocktokit.rest.issues.createComment).toHaveBeenCalledTimes(1)
    expect(core.setFailed).toHaveBeenCalledTimes(1)
  })

  it('Sets the organization output', async () => {
    getInputsMock.mockReset().mockReturnValueOnce({
      action: Action.CHECK_AUTO_DEMOTION,
      parsedIssue: {
        organization: 'test'
      }
    } as Inputs)

    await run()

    expect(check.constructor).toHaveBeenCalledTimes(1)
    expect(check.validate).toHaveBeenCalledTimes(1)
    expect(check.execute).toHaveBeenCalledTimes(1)
    expect(core.setOutput).toHaveBeenCalledWith('organization', 'test')
  })

  describe('check_auto_demotion', () => {
    it('Runs CheckAutoDemotionAction', async () => {
      getInputsMock.mockReset().mockReturnValueOnce({
        action: Action.CHECK_AUTO_DEMOTION
      } as Inputs)

      await run()

      expect(check.constructor).toHaveBeenCalledTimes(1)
      expect(check.validate).toHaveBeenCalledTimes(1)
      expect(check.execute).toHaveBeenCalledTimes(1)
    })
  })

  describe('demotion_report', () => {
    it('Runs DemotionReportAction', async () => {
      getInputsMock.mockReset().mockReturnValueOnce({
        action: Action.DEMOTION_REPORT
      } as Inputs)

      await run()

      expect(report.constructor).toHaveBeenCalledTimes(1)
      expect(report.validate).toHaveBeenCalledTimes(1)
      expect(report.execute).toHaveBeenCalledTimes(1)
    })
  })

  describe('promote_demote', () => {
    it('Runs PromoteDemoteAction', async () => {
      getInputsMock.mockReset().mockReturnValueOnce({
        action: Action.PROMOTE_DEMOTE
      } as Inputs)

      await run()

      expect(promote.constructor).toHaveBeenCalledTimes(1)
      expect(promote.validate).toHaveBeenCalledTimes(1)
      expect(promote.execute).toHaveBeenCalledTimes(1)
    })
  })
})

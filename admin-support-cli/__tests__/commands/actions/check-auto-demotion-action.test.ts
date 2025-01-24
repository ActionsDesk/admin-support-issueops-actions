import { jest } from '@jest/globals'
import * as core from '../../../__fixtures__/@actions/core.js'
import * as github from '../../../__fixtures__/@actions/github.js'
import * as issueParser from '../../../__fixtures__/@github/issue-parser.js'
import * as octokit from '../../../__fixtures__/@octokit/rest.js'
import { getInputsMock } from '../../../__fixtures__/inputs.js'
import { Action } from '../../../src/enums.js'
import type { Inputs } from '../../../src/types.js'

// Mocks should be declared before the module being tested is imported.
jest.unstable_mockModule('@actions/core', () => core)
jest.unstable_mockModule('@actions/github', () => github)
jest.unstable_mockModule('@github/issue-parser', () => issueParser)
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

jest.unstable_mockModule('../../../src/inputs.js', () => ({
  getInputs: getInputsMock
}))

// The module being tested should be imported dynamically. This ensures that the
// mocks are used in place of any actual dependencies.
const { CheckAutoDemotionAction } = await import(
  '../../../src/commands/actions/check-auto-demotion-action.js'
)

const { Octokit } = await import('@octokit/rest')
const mocktokit = jest.mocked(new Octokit())

describe('CheckAutoDemotionAction', () => {
  beforeEach(() => {
    getInputsMock.mockReset().mockReturnValueOnce({
      action: Action.CHECK_AUTO_DEMOTION
    } as Inputs)
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('constructor', () => {
    it('Sets the params and api properties', () => {
      const check = new CheckAutoDemotionAction()

      expect(check.params).toEqual({
        action: Action.CHECK_AUTO_DEMOTION
      })
      expect(check.api).toEqual(mocktokit)
    })
  })

  describe('validate', () => {
    it('Does nothing', async () => {
      const check = new CheckAutoDemotionAction()

      await check.validate()

      expect(core.info).toHaveBeenCalled()
    })
  })

  describe('execute', () => {
    it('Processes the issue list', async () => {
      mocktokit.paginate.mockResolvedValueOnce([
        {
          body: 'body',
          created_at: '2025-01-01T00:00:00Z',
          number: 1
        }
      ])
      issueParser.parseIssue.mockReturnValueOnce({
        duration: '1'
      })

      const check = new CheckAutoDemotionAction()

      await check.execute()

      expect(mocktokit.paginate).toHaveBeenCalled()
      expect(issueParser.parseIssue).toHaveBeenCalledTimes(1)
      expect(mocktokit.rest.issues.update).toHaveBeenCalled()
    })
  })
})

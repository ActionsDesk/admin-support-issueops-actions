import { jest } from '@jest/globals'
import * as core from '../../../__fixtures__/@actions/core.js'
import * as github from '../../../__fixtures__/@actions/github.js'
import * as octokit from '../../../__fixtures__/@octokit/rest.js'
import { getInputsMock } from '../../../__fixtures__/inputs.js'
import { Action } from '../../../src/enums.js'
import type { Inputs } from '../../../src/types.js'

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

jest.unstable_mockModule('../../../src/inputs.js', () => ({
  getInputs: getInputsMock
}))

// The module being tested should be imported dynamically. This ensures that the
// mocks are used in place of any actual dependencies.
const { PromoteDemoteAction } = await import(
  '../../../src/commands/actions/promote-demote-action.js'
)

const { Octokit } = await import('@octokit/rest')
const mocktokit = jest.mocked(new Octokit())

describe('PromoteDemoteAction', () => {
  beforeEach(() => {
    getInputsMock.mockReset().mockReturnValueOnce({
      action: Action.PROMOTE_DEMOTE
    } as Inputs)
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('constructor', () => {
    it('Sets the params and api properties', () => {
      const promote = new PromoteDemoteAction()

      expect(promote.params).toEqual({
        action: Action.PROMOTE_DEMOTE
      })
      expect(promote.api).toEqual(mocktokit)
    })
  })

  describe('validate', () => {
    it('Fails if no issue is provided', async () => {
      getInputsMock.mockReset().mockReturnValueOnce({} as Inputs)

      const promote = new PromoteDemoteAction()

      await expect(promote.validate()).rejects.toThrow()
    })

    it('Fails if no username is provided', async () => {
      getInputsMock.mockReset().mockReturnValueOnce({
        parsedIssue: {}
      } as Inputs)

      const promote = new PromoteDemoteAction()

      await expect(promote.validate()).rejects.toThrow()
    })

    it('Fails if no role is provided', async () => {
      getInputsMock.mockReset().mockReturnValueOnce({
        parsedIssue: {},
        username: 'mona'
      } as Inputs)

      const promote = new PromoteDemoteAction()

      await expect(promote.validate()).rejects.toThrow()
    })

    it('Fails if an invalid org is provided', async () => {
      getInputsMock.mockReset().mockReturnValueOnce({
        parsedIssue: {
          organization: 'invalid'
        },
        username: 'mona',
        role: 'admin',
        allowedOrgs: ['valid']
      } as Inputs)

      const promote = new PromoteDemoteAction()

      await expect(promote.validate()).rejects.toThrow()
    })
  })

  describe('execute', () => {
    it('Processes the role change', async () => {
      getInputsMock.mockReset().mockReturnValueOnce({
        parsedIssue: {
          organization: 'valid'
        },
        username: 'mona',
        role: 'admin',
        allowedOrgs: ['valid']
      } as Inputs)

      const promote = new PromoteDemoteAction()

      await promote.execute()

      expect(mocktokit.rest.orgs.setMembershipForUser).toHaveBeenCalled()
    })

    it('Processes an API failure', async () => {
      getInputsMock.mockReset().mockReturnValueOnce({
        parsedIssue: {
          organization: 'valid'
        },
        username: 'mona',
        role: 'admin',
        allowedOrgs: ['valid']
      } as Inputs)

      mocktokit.rest.orgs.setMembershipForUser.mockRejectedValue({
        status: 500,
        message: 'API error'
      })

      const promote = new PromoteDemoteAction()

      const result = await promote.execute()

      expect(result).toMatchObject({
        status: 'error',
        output: 'API error'
      })
    })
  })
})

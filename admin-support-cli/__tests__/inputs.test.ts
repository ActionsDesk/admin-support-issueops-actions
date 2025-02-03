import { jest } from '@jest/globals'
import * as core from '../__fixtures__/@actions/core.js'

// Mocks should be declared before the module being tested is imported.
jest.unstable_mockModule('@actions/core', () => core)

// The module being tested should be imported dynamically. This ensures that the
// mocks are used in place of any actual dependencies.
const { getInputs } = await import('../src/inputs.js')

describe('inputs.ts', () => {
  beforeEach(() => {
    core.getInput
      .mockReset()
      .mockReturnValueOnce('check_auto_demotion') // action
      .mockReturnValueOnce('MY_ADMIN_TOKEN') // admin_token
      .mockReturnValueOnce('org1,org2') // allowed_orgs
      .mockReturnValueOnce('') // demotion_date
      .mockReturnValueOnce('') // issue_number
      .mockReturnValueOnce('') // parsed_issue
      .mockReturnValueOnce('') // promotion_date
      .mockReturnValueOnce('') // report_path
      .mockReturnValueOnce('') // role
      .mockReturnValueOnce('') // username
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('Fails if the action is invalid', () => {
    core.getInput
      .mockReset()
      .mockReturnValueOnce('invalid') // action
      .mockReturnValueOnce('MY_ADMIN_TOKEN') // admin_token
      .mockReturnValueOnce('org1,org2') // allowed_orgs
      .mockReturnValueOnce('') // demotion_date
      .mockReturnValueOnce('') // issue_number
      .mockReturnValueOnce('') // parsed_issue
      .mockReturnValueOnce('') // promotion_date
      .mockReturnValueOnce('') // report_path
      .mockReturnValueOnce('') // role
      .mockReturnValueOnce('') // username

    expect(() => getInputs()).toThrow()
  })

  it('Fails if demotion date is invalid', () => {
    core.getInput
      .mockReset()
      .mockReturnValueOnce('check_auto_demotion') // action
      .mockReturnValueOnce('MY_ADMIN_TOKEN') // admin_token
      .mockReturnValueOnce('org1,org2') // allowed_orgs
      .mockReturnValueOnce('invalid') // demotion_date
      .mockReturnValueOnce('') // issue_number
      .mockReturnValueOnce('') // parsed_issue
      .mockReturnValueOnce('') // promotion_date
      .mockReturnValueOnce('') // report_path
      .mockReturnValueOnce('') // role
      .mockReturnValueOnce('') // username

    expect(() => getInputs()).toThrow()
  })

  it('Fails if issue number is invalid', () => {
    core.getInput
      .mockReset()
      .mockReturnValueOnce('check_auto_demotion') // action
      .mockReturnValueOnce('MY_ADMIN_TOKEN') // admin_token
      .mockReturnValueOnce('org1,org2') // allowed_orgs
      .mockReturnValueOnce('') // demotion_date
      .mockReturnValueOnce('invalid') // issue_number
      .mockReturnValueOnce('') // parsed_issue
      .mockReturnValueOnce('') // promotion_date
      .mockReturnValueOnce('') // report_path
      .mockReturnValueOnce('') // role
      .mockReturnValueOnce('') // username

    expect(() => getInputs()).toThrow()
  })

  it('Fails if promotion date is invalid', () => {
    core.getInput
      .mockReset()
      .mockReturnValueOnce('check_auto_demotion') // action
      .mockReturnValueOnce('MY_ADMIN_TOKEN') // admin_token
      .mockReturnValueOnce('org1,org2') // allowed_orgs
      .mockReturnValueOnce('') // demotion_date
      .mockReturnValueOnce('') // issue_number
      .mockReturnValueOnce('') // parsed_issue
      .mockReturnValueOnce('invalid') // promotion_date
      .mockReturnValueOnce('') // report_path
      .mockReturnValueOnce('') // role
      .mockReturnValueOnce('') // username

    expect(() => getInputs()).toThrow()
  })

  it('Fails if role is invalid', () => {
    core.getInput
      .mockReset()
      .mockReturnValueOnce('check_auto_demotion') // action
      .mockReturnValueOnce('MY_ADMIN_TOKEN') // admin_token
      .mockReturnValueOnce('org1,org2') // allowed_orgs
      .mockReturnValueOnce('') // demotion_date
      .mockReturnValueOnce('') // issue_number
      .mockReturnValueOnce('') // parsed_issue
      .mockReturnValueOnce('') // promotion_date
      .mockReturnValueOnce('') // report_path
      .mockReturnValueOnce('invalid') // role
      .mockReturnValueOnce('') // username

    expect(() => getInputs()).toThrow()
  })
})

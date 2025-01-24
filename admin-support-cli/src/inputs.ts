import * as core from '@actions/core'
import { Action, Role } from './enums.js'
import type { Inputs } from './types.js'

export function getInputs(): Inputs {
  /** Required Inputs */
  const action = core.getInput('action', { required: true })
  const adminToken = core.getInput('admin_token', { required: true })
  const allowedOrgs = core
    .getInput('allowed_orgs', { required: true })
    .split(/,\s?/)

  /** Optional Inputs */
  const demotionDate = core.getInput('demotionDate')
  const issueNumber = core.getInput('issue_number')
  const parsedIssue = core.getInput('parsed_issue')
  const promotionDate = core.getInput('promotionDate')
  const reportPath = core.getInput('report_path')
  const role = core.getInput('role').toLowerCase()
  const username = core.getInput('username')

  // Validate the inputs

  // Action must be a valid action
  if (!Object.values(Action).includes(action as Action))
    throw new Error('Action must be a valid action')

  // Demotion date must be a valid date
  if (demotionDate !== '' && isNaN(Date.parse(demotionDate)))
    throw new Error('Demotion date must be a valid date')

  // Issue number must be a number
  if (issueNumber !== '' && isNaN(parseInt(issueNumber)))
    throw new Error('Issue number must be a number')

  // Promotion date must be a valid date
  if (promotionDate !== '' && isNaN(Date.parse(promotionDate)))
    throw new Error('Promotion date must be a valid date')

  // Role must be "admin" or "member"
  if (role !== '' && !Object.values(Role).includes(role as Role))
    throw new Error('Role must be "admin" or "member"')

  return {
    /** Required Inputs */
    action,
    allowedOrgs,
    adminToken,

    /** Optional Inputs */
    demotionDate: demotionDate !== '' ? new Date(demotionDate) : undefined,
    issueNumber: issueNumber !== '' ? parseInt(issueNumber) : undefined,
    parsedIssue: parsedIssue !== '' ? JSON.parse(parsedIssue) : undefined,
    promotionDate: promotionDate !== '' ? new Date(promotionDate) : undefined,
    reportPath: reportPath !== '' ? reportPath : undefined,
    role: role !== '' ? (role as Role) : undefined,
    username: username !== '' ? username : undefined
  }
}

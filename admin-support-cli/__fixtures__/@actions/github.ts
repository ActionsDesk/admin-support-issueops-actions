import * as octokit from '../@octokit/rest.js'

export const getOctokit = () => octokit

export const context = {
  repo: {
    owner: 'ActionsDesk',
    repo: 'admin-support-issueops-actions'
  },
  payload: {
    action: 'opened',
    issue: {
      assignee: {
        login: 'ncalteen'
      },
      body: '### Organization\n\nocto-org\n\nDescription\n\nI need admin access to the octo-org organization\n\nTicket\n\n1234\n\nDuration\n\n1',
      closed_at: null,
      created_at: '2025-01-24T12:00:00Z',
      number: 1,
      state: 'open',
      state_reason: null,
      title: 'Administrative Access Request',
      updated_at: '2025-01-24T12:00:00Z',
      user: {
        login: 'ncalteen'
      }
    },
    organization: {
      login: 'ActionsDesk'
    },
    repository: {
      full_name: 'ActionsDesk/admin-support-issueops-actions',
      name: 'admin-support-issueops-actions',
      owner: {
        login: 'ActionsDesk'
      },
      url: 'https://api.github.com/repos/ActionsDesk/admin-support-issueops-actions'
    }
  },
  eventName: 'issues',
  action: 'opened'
}

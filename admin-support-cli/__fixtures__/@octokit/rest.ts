import { jest } from '@jest/globals'
import { Endpoints } from '@octokit/types'

export const graphql = jest.fn()
export const paginate = jest.fn()
export const rest = {
  issues: {
    createComment:
      jest.fn<
        () => Promise<
          Endpoints['POST /repos/{owner}/{repo}/issues/{issue_number}/comments']['response']
        >
      >(),
    listForRepo:
      jest.fn<
        () => Promise<Endpoints['GET /repos/{owner}/{repo}/issues']['response']>
      >(),
    update:
      jest.fn<
        () => Promise<
          Endpoints['PATCH /repos/{owner}/{repo}/issues/{issue_number}']['response']
        >
      >()
  },
  orgs: {
    setMembershipForUser:
      jest.fn<
        () => Promise<
          Endpoints['PUT /orgs/{org}/memberships/{username}']['response']
        >
      >()
  }
}

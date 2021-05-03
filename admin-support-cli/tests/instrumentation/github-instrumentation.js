const nock = require('nock')
const { buildV3Octokit, buildV4Octokit } = require('../../src/utils/api-builder')

const GITHUB_URL = 'https://api.github.com'

module.exports = {
  githubUrl: GITHUB_URL,
  githubInstrumentation: () => {
    nock.disableNetConnect()
    // Used for supertest and the local server
    nock.enableNetConnect('127.0.0.1')

    // Remove all log implementations
    jest.spyOn(console, 'error').mockImplementation(() => {})
    jest.spyOn(console, 'warn').mockImplementation(() => {})
    jest.spyOn(console, 'log').mockImplementation(() => {})
  },
  replyGithubResponse: (path, interceptor) => {
    nock(GITHUB_URL)
      .post(path)
      .reply(200, interceptor)
  },
  replyGithubGetResponse: (path, params, interceptor) => {
    nock(GITHUB_URL)
      .get(path)
      .query(params || true)
      .reply(200, interceptor)
  },
  replyGithubPatchResponse: (path, interceptor) => {
    nock(GITHUB_URL)
      .patch(path)
      .reply(200, interceptor)
  },
  githubInstrumentationTeardown: () => {
    nock.cleanAll()
    nock.enableNetConnect()
  },
  /* eslint-disable */
  getOctokit: () => {
    return buildV3Octokit('123456789', false)
  },
  getGraphQL: () => {
    return buildV4Octokit('123456789')
  },
  /* eslint-enable */
  mockApis: () => {
    return {
      v3: module.exports.getOctokit(),
      v4: module.exports.getGraphQL()
    }
  }
}

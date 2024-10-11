const fetchMock = require('fetch-mock-jest');

const { buildV3Octokit, buildV4Octokit } = require('../../src/utils/api-builder')

const GITHUB_URL = 'https://api.github.com'

module.exports = {
  githubUrl: GITHUB_URL,
  githubInstrumentation: () => {
    // Remove all log implementations
    jest.spyOn(console, 'error').mockImplementation(() => {})
    jest.spyOn(console, 'warn').mockImplementation(() => {})
    jest.spyOn(console, 'log').mockImplementation(() => {})
  },
  replyGithubResponse: (path, interceptor) => {
    fetchMock.post(`${GITHUB_URL}${path}`, {
      status: 200,
      body: interceptor
    });
  },
  replyGithubGetResponse: (path, params, interceptor) => {
    const url = new URL(`${GITHUB_URL}${path}`);
    if (params) {
      Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
    }
    fetchMock.get(url, {
      status: 200,
      body: interceptor
    });
  },
  replyGithubPatchResponse: (path, interceptor) => {
    fetchMock.patch(`${GITHUB_URL}${path}`, {
      status: 200,
      body: interceptor
    });
  },
  githubInstrumentationTeardown: () => {
    fetchMock.restore();
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

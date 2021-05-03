const { graphql } = require('@octokit/graphql')
const { Octokit } = require('@octokit/rest')
const { retry } = require('@octokit/plugin-retry')
const { throttling } = require('@octokit/plugin-throttling')

module.exports = {
  buildV3Octokit: (token, withPlugins) => {
    let octokit
    const hasPlugins = withPlugins !== false
    if (hasPlugins) {
      const Octo = Octokit.plugin(retry, throttling)
      octokit = new Octo({
        auth: token,
        throttle: {
          onRateLimit: (retryAfter, _) => {
            octokit.log.warn(
              `[${new Date().toISOString()}] Request quota exhausted for request, will retry in ${retryAfter}`
            )
            return true
          },
          onAbuseLimit: (retryAfter, _) => {
            octokit.log.warn(
              `[${new Date().toISOString()}] Abuse detected for request, will retry in ${retryAfter}`
            )
            return true
          }
        }
      })
    } else {
      octokit = new Octokit({
        auth: token
      })
    }
    return octokit
  },
  buildV4Octokit: (token) => {
    return graphql.defaults({
      headers: {
        authorization: `token ${token}`
      }
    })
  }
}

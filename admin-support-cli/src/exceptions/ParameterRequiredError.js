class ParameterRequiredError extends Error {
  constructor (message) {
    super(message)
    this.name = 'ParameterRequiredError'
    this.message = message
  }
}

module.exports = ParameterRequiredError

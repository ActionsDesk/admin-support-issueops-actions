class ParameterValidationError extends Error {
  constructor (message) {
    super(message)
    this.name = 'Parameter validation error'
    this.message = message
  }
}

module.exports = ParameterValidationError

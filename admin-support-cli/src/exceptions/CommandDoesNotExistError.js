class CommandDoesNotExistError extends Error {
  constructor (message) {
    super(message)
    this.name = 'CommandDoesNotExistError'
    this.message = message
  }
}

module.exports = CommandDoesNotExistError

export class CommandDoesNotExistError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'CommandDoesNotExistError'
    this.message = message
  }
}

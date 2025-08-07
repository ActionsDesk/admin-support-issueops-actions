export class ParameterRequiredError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ParameterRequiredError'
    this.message = message
  }
}

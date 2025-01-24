export class ParameterValidationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'Parameter validation error'
    this.message = message
  }
}

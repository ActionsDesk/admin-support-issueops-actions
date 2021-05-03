class Command {
  constructor (api, params) {
    this.api = api
    this.params = params
    if (this.constructor === Command) throw new Error("Abstract classes can't be instantiated.")
  }

  async validate () {
    throw new Error("Method 'validate()' must be implemented first")
  }

  async execute () {
    throw new Error("Method 'execute()' must be implemented first")
  }

  static getName () {
    throw new Error("Method 'getName()' must be implemented first")
  }
}

module.exports = Command

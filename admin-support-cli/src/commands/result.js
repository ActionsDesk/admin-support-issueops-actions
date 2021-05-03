class Result {
  constructor (status, output) {
    this.status = status || 'undefined'
    this.output = output || ''
  }

  status () {
    return this.status
  }

  output () {
    return this.output
  }
}

module.exports = Result

import { jest } from '@jest/globals'
import { getInputsMock } from '../../../__fixtures__/inputs.js'
import type { Inputs } from '../../../src/types.js'

export const api = jest.fn()
export const constructor = jest.fn()
export const validate = jest.fn()
export const execute = jest.fn()

export class PromoteDemoteAction {
  api = api
  params: Inputs = getInputsMock()

  constructor() {
    constructor()
  }

  async validate() {
    validate()
  }

  async execute() {
    return execute()
  }
}

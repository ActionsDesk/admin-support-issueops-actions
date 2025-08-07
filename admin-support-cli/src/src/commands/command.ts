import type { Inputs, Result } from '../types.js'

export interface Command {
  api: any
  params: Inputs

  validate(): Promise<void>
  execute(): Promise<Result>
}

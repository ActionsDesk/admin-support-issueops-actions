import { jest } from '@jest/globals'

export const existsSync = jest.fn()
export const mkdirSync = jest.fn()
export const readdirSync = jest.fn()
export const readFileSync = jest.fn()
export const realpathSync = jest.fn()
export const statSync = jest.fn()
export const writeFileSync = jest.fn()

export default {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  realpathSync,
  statSync,
  writeFileSync
}

import { jest } from '@jest/globals'

import type { getInputs } from '../src/inputs.js'

export const getInputsMock = jest.fn<typeof getInputs>()

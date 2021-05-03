const PromoteDemoteAction = require('../src/commands/actions/promote-demote-action')
const ParameterRequiredError = require('../src/exceptions/ParameterRequiredError')

describe('Promote-Demote action', () => {
  describe('method: validate()', () => {
    test('validate() - ParameterRequiredError exception - missing username', () => {
      const mockApi = {
        v3: () => { return 'v3' },
        v4: () => { return 'v4' }
      }
      const mockParams = {
        action: 'promote_demote',
        adminToken: '5a8dd3ad0756a93ded72b823b19dd877',
        role: 'member',
        org: 'test-org',
        repository: 'test-support'
      }
      const actionInstance = new PromoteDemoteAction(mockApi, mockParams)
      expect(actionInstance.params.username).toBeUndefined()
      expect(() => actionInstance.validate().toThrow(ParameterRequiredError))
    })

    test('validate() - ParameterRequiredError exception - missing org', () => {
      const mockApi = {
        v3: () => { return 'v3' },
        v4: () => { return 'v4' }
      }
      const mockParams = {
        action: 'promote_demote',
        adminToken: '5a8dd3ad0756a93ded72b823b19dd877',
        username: 'link-ghost',
        role: 'member',
        repository: 'test-support'
      }
      const actionInstance = new PromoteDemoteAction(mockApi, mockParams)
      expect(actionInstance.params.org).toBeUndefined()
      expect(() => actionInstance.validate().toThrow(ParameterRequiredError))
    })

    test('validate() - ParameterRequiredError exception - missing role', () => {
      const mockApi = {
        v3: () => { return 'v3' },
        v4: () => { return 'v4' }
      }
      const mockParams = {
        action: 'promote_demote',
        adminToken: '5a8dd3ad0756a93ded72b823b19dd877',
        username: 'link-ghost',
        org: 'test-org',
        repository: 'test-support'
      }
      const actionInstance = new PromoteDemoteAction(mockApi, mockParams)
      expect(actionInstance.params.role).toBeUndefined()
      expect(() => actionInstance.validate().toThrow(ParameterRequiredError))
    })

    test('validate() - ParameterRequiredError exception - role not accepted', () => {
      const mockApi = {
        v3: () => { return 'v3' },
        v4: () => { return 'v4' }
      }
      const mockParams = {
        action: 'promote_demote',
        adminToken: '5a8dd3ad0756a93ded72b823b19dd877',
        username: 'link-ghost',
        role: 'MotherSuperior',
        org: 'test-org',
        repository: 'test-support'
      }
      const actionInstance = new PromoteDemoteAction(mockApi, mockParams)
      expect(() => actionInstance.validate().toThrow(ParameterRequiredError))
    })
  })

  describe('method: getName()', () => {
    test('getName() - returns action name', () => {
      expect(PromoteDemoteAction.getName()).toEqual('promote_demote')
    })
  })

  describe('method: execute()', () => {
    test('execute() - successful role change', () => {
      const mockApi = {
        v3: { orgs: { setMembershipForUser: jest.fn() } },
        v4: jest.fn()
      }
      const mockParams = {
        action: 'promote_demote',
        adminToken: '5a8dd3ad0756a93ded72b823b19dd877',
        username: 'link-ghost',
        role: 'MotherSuperior',
        org: 'test-org',
        repository: 'test-support'
      }
      const actionInstance = new PromoteDemoteAction(mockApi, mockParams)
      actionInstance.api.v3.orgs.setMembershipForUser.mockReturnValue(Promise.resolve({
        status: 200
      }))
      actionInstance.execute()
    })
  })
})

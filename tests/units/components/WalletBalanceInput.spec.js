import { shallowMount } from '@vue/test-utils'
import WalletBalanceInput from '@/components/WalletBalanceInput'

describe('WalletPage.vue', () => {
  let wrapper

  beforeEach(async () => {
    wrapper = shallowMount(WalletBalanceInput, {
      propsData: { balance: null }
    })
  })

  it('gives is-valid props as null on mounted', () => {
    expect(wrapper.vm.isValid).toEqual(null)
  })

  describe('when balance is not valid', () => {
    beforeEach(() => {
      wrapper.setProps({ balance: -5 })
    })

    it('gives is-valid props as false', () => {
      expect(wrapper.vm.isValid).toEqual(false)
    })
  })

  describe('when balance is valid', () => {
    beforeEach(() => {
      wrapper.setProps({ balance: 5 })
    })

    it('gives is-valid props as true', () => {
      expect(wrapper.vm.isValid).toEqual(true)
    })
  })
})

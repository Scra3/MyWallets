import { shallowMount } from '@vue/test-utils'
import WalletBalanceInput from '@/components/WalletBalanceInput'

describe('WalletPage.vue', () => {
  let wrapper

  beforeEach(async () => {
    wrapper = shallowMount(WalletBalanceInput, {
      propsData: { balance: null, isValid: null }
    })
  })

  it('gives is-valid props as null on mounted', () => {
    expect(wrapper.find('InputField-stub').props('isValid')).toEqual(null)
  })

  describe('when balance is not valid', () => {
    beforeEach(() => {
      wrapper.setProps({ balance: -5, isValid: false })
    })

    it('provides is-valid props as false', () => {
      expect(wrapper.find('InputField-stub').props('isValid')).toEqual(false)
    })
  })

  describe('when balance is valid', () => {
    beforeEach(() => {
      wrapper.setProps({ balance: 5, isValid: true })
    })

    it('gives is-valid props as true', () => {
      expect(wrapper.find('InputField-stub').props('isValid')).toEqual(true)
    })
  })
})

import { shallowMount } from '@vue/test-utils'
import WalletAddressInput from '@/components/WalletAddressInput'
import { BTC } from '@/constants'
import flushPromises from 'flush-promises'

describe('WalletPage.vue', () => {
  let wrapper

  beforeEach(async () => {
    wrapper = shallowMount(WalletAddressInput, {
      propsData: { address: 'anAddress', coinId: BTC }
    })
  })

  it('gives is-valid props as null on mounted', () => {
    expect(wrapper.vm.isValid).toEqual(null)
  })

  describe('when address is not valid', () => {
    it('gives is-valid props as false', async () => {
      wrapper.vm.$_checkAddressValidity = jest.fn(() => Promise.resolve(false))

      wrapper.setProps({ address: 'badAddress' })
      await flushPromises()

      expect(wrapper.vm.isValid).toEqual(false)
    })

    it('gives is-valid props as false when address is null', () => {
      wrapper.setProps({ address: null })

      expect(wrapper.vm.isValid).toEqual(false)
    })
  })

  describe('when address is valid', () => {
    it('gives is-valid props as false', async () => {
      wrapper.vm.$_checkAddressValidity = jest.fn(() => Promise.resolve(true))

      wrapper.setProps({ address: 'badAddress' })
      await flushPromises()

      expect(wrapper.vm.isValid).toEqual(true)
    })
  })

  describe('when checking address', () => {
    it('gives is-checking props as true', () => {
      wrapper.vm.$_checkAddressValidity = jest.fn()

      wrapper.setProps({ address: 'newAddress' })

      expect(wrapper.vm.isCheckingAddress).toEqual(true)
    })
  })

  describe('when verification failed', () => {
    it('displays connection error message', async () => {
      wrapper.vm.$_checkAddressValidity = jest.fn(() => Promise.reject('error'))

      wrapper.setProps({ address: 'addressChanged' })
      await flushPromises()

      expect(wrapper.vm.labelError).toBe(wrapper.vm.connectionLabelError)
    })
  })
})

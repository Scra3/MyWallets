import { shallowMount } from '@vue/test-utils'
import WalletAddressInput from '@/components/WalletAddressInput'
import flushPromises from 'flush-promises'
import * as camera from 'nativescript-camera'

jest.mock('nativescript-camera', () => {
  return { requestPermissions: jest.fn(() => Promise.resolve()) }
})
jest.mock('nativescript-barcodescanner', () => {
  return {
    BarcodeScanner: jest.fn(() => {
      return {
        scan: jest.fn(() => Promise.resolve({ text: 'newScannedAddress' }))
      }
    })
  }
})

describe('WalletPage.vue', () => {
  let wrapper

  beforeEach(async () => {
    wrapper = shallowMount(WalletAddressInput, {
      propsData: {
        address: 'anAddress',
        isValid: null,
        hasConnectionError: false,
        isCheckingAddress: false
      }
    })
  })

  it('gives is-valid props as null on mounted', () => {
    expect(wrapper.find('InputField-stub').props('isValid')).toEqual(null)
  })

  describe('when address is not valid', () => {
    it('provides is-valid props as false', () => {
      wrapper.setProps({ address: 'badAddress', isValid: false })

      expect(wrapper.find('InputField-stub').props('isValid')).toEqual(false)
    })
  })

  describe('when address is valid', () => {
    it('gives is-valid props as false', () => {
      wrapper.setProps({ address: 'goodAddress', isValid: true })

      expect(wrapper.find('InputField-stub').props('isValid')).toEqual(true)
    })
  })

  describe('when checking address', () => {
    it('gives is-checking props as true', () => {
      wrapper.setProps({ address: 'newAddress', isCheckingAddress: true })

      expect(wrapper.find('InputField-stub').props('isChecking')).toEqual(true)
    })
  })

  describe('when verification failed', () => {
    it('displays connection error message', () => {
      wrapper.setProps({ address: 'addressChanged', hasConnectionError: true })

      expect(wrapper.find('InputField-stub').props('labelError')).toBe(
        wrapper.vm.connectionLabelError
      )
    })
  })

  it('displays scanner button', () => {
    expect(wrapper.findDataTest('scanner-button').isVisible()).toBe(true)
  })

  it('displays scanner when scanner button is clicked', async () => {
    wrapper.vm.scan = jest.fn()
    wrapper.findDataTest('scanner-button').vm.$emit('tap')
    await flushPromises()

    expect(wrapper.vm.scan).toHaveBeenCalled()
  })

  it('requests permission when scanner button is clicked', async () => {
    wrapper.findDataTest('scanner-button').vm.$emit('tap')
    await flushPromises()

    expect(camera.requestPermissions).toHaveBeenCalled()
  })

  it('emits new address when user has finished to scan', async () => {
    wrapper.findDataTest('scanner-button').vm.$emit('tap')
    await flushPromises()

    expect(wrapper.emitted('address-did-change')[0][0]).toEqual(
      'newScannedAddress'
    )
  })
})

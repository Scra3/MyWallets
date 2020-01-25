import { shallowMount } from '@vue/test-utils'
import InputField from '@/components/InputField'

describe('WalletPage.vue', () => {
  let wrapper

  beforeEach(async () => {
    wrapper = shallowMount(InputField, {
      propsData: {
        value: 'aValue',
        label: 'aLabel',
        labelError: 'aLabelError'
      }
    })
  })

  it('displays input', () => {
    expect(wrapper.findDataTest('input').isVisible()).toBe(true)
  })

  it('does not display displays failed icon when isValid prop is null', () => {
    expect(wrapper.findDataTest('failed-icon').exists()).toBe(false)
  })

  it('does not display label error when isValid prop is null', () => {
    expect(wrapper.findDataTest('label-error').exists()).toBe(false)
  })

  it('does not add error css class when isValid prop is null', () => {
    expect(wrapper.findDataTest('input').classes()).not.toContain('error')
  })

  it('emits an event when input value changed', () => {
    wrapper.findDataTest('input').vm.$emit('textChange', { value: 'newValue' })

    expect(wrapper.emitted('value-did-change')[0][0]).toEqual('newValue')
  })

  it('emits an event when input is unfocused', () => {
    wrapper.findDataTest('input').vm.$emit('blur', { value: 'newValue' })

    expect(wrapper.emitted('input-did-unfocus')[0][0]).toEqual('newValue')
  })

  describe('when value is not valid', () => {
    beforeEach(() => {
      wrapper.setProps({ isValid: false })
    })

    it('displays failed icon', () => {
      expect(wrapper.findDataTest('failed-icon').isVisible()).toBe(true)
    })

    it('displays label error', () => {
      expect(wrapper.findDataTest('label-error').isVisible()).toBe(true)
    })

    it('adds error css class', () => {
      expect(wrapper.findDataTest('input').classes()).toContain('error')
    })

    it('does not displays success icon', () => {
      expect(wrapper.findDataTest('success-icon').exists()).toBe(false)
    })
  })

  describe('when value is valid', () => {
    beforeEach(() => {
      wrapper.setProps({ isValid: true })
    })

    it('does not display failed icon', () => {
      expect(wrapper.findDataTest('failed-icon').exists()).toBe(false)
    })

    it('displays success icon', () => {
      expect(wrapper.findDataTest('success-icon').isVisible()).toBe(true)
    })

    it('does not display label error', () => {
      expect(wrapper.findDataTest('label-error').exists()).toBe(false)
    })

    it('adds success css class', () => {
      expect(wrapper.findDataTest('input').classes()).toContain('success')
    })
  })

  describe('when value is checking', () => {
    beforeEach(() => {
      wrapper.setProps({ isChecking: true })
    })

    it('does not display failed icon', () => {
      expect(wrapper.find('ActivityIndicator-stub').isVisible()).toBe(true)
    })
  })
})

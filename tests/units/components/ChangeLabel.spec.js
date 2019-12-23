import { shallowMount } from '@vue/test-utils'
import ChangeLabel from '@/components/ChangeLabel'

describe('ChangeLabel.vue', () => {
  let wrapper
  beforeEach(() => {
    wrapper = shallowMount(ChangeLabel, {
      propsData: {
        value: 7.5,
        unit: '%'
      }
    })
  })

  it('displays change percentage with positive sign and color when value is positive', () => {
    expect(wrapper.findDataTest('change-label').classes()[0]).toEqual(
      'positive-change'
    )

    expect(
      wrapper.findDataTest('change-label').attributes().text
    ).toEqual('+7.50%')
  })

  it('displays change percentage with negative sign and color when value is negative', () => {
    wrapper.setProps({ value: -7.5 })
    expect(wrapper.findDataTest('change-label').classes()[0]).toEqual(
      'negative-change'
    )

    expect(
      wrapper.findDataTest('change-label').attributes().text
    ).toEqual('-7.50%')
  })

  it('fixes float to 2 decimals', () => {
    wrapper.setProps({ value: -7.55555 })
    expect(
      wrapper.findDataTest('change-label').attributes().text
    ).toEqual('-7.56%')
  })
})

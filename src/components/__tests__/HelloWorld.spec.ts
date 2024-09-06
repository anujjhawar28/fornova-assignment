import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import Elevator from '../Elevator.vue'

describe('Elevator', () => {
  it('renders properly', () => {
    const wrapper = mount(Elevator, { props: { msg: 'Hello Vitest' } })
    expect(wrapper.text()).toContain('Hello Vitest')
  })
})

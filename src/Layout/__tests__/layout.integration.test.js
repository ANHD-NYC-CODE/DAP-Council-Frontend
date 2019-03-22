import React from 'react'
import { configure, mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { Axios } from 'shared/utilities/Axios'
import MockAdapter from 'axios-mock-adapter'
import { setupStore, configuredState } from 'shared/testUtilities'

import { Provider } from 'react-redux'

const mock = new MockAdapter(Axios)

import App from 'App'

configure({ adapter: new Adapter() })

const setupWrapper = state => {
  state = configuredState(state)

  const store = setupStore({ ...state })
  const wrapper = mount(
    <Provider store={store}>
      <App />
    </Provider>
  )
  return wrapper
}

describe('navigation', () => {
  it('displays the initial navigation', () => {
    const wrapper = setupWrapper()
    expect(wrapper.find('NavigationBar')).toHaveLength(1)
    expect(wrapper.find('NavigationBar li')).toHaveLength(7)
    expect(wrapper.find('NavigationBar').text()).toMatch(/HomeDAP MapDistrict ReportsWatch ListPortalAboutContactLogin/)
    expect(wrapper.find('SubHeader')).toHaveLength(1)
    expect(wrapper.find('SubHeader li')).toHaveLength(4)
    expect(wrapper.find('SubHeader').text()).toMatch(/Building LookupAlert MapAdvanced Search/)
    expect(
      wrapper
        .find('SubHeader a')
        .at(0)
        .props().href
    ).toEqual('/')
    expect(
      wrapper
        .find('SubHeader a')
        .at(1)
        .props().href
    ).toEqual('/lookup')
    expect(
      wrapper
        .find('SubHeader a')
        .at(2)
        .props().href
    ).toEqual('/map')
    expect(
      wrapper
        .find('SubHeader a')
        .at(3)
        .props().href
    ).toEqual('/search')
  })

  describe('with current geography app state', () => {
    it('changes district map link to the selected geography', () => {
      const wrapper = setupWrapper({ appState: { currentGeographyType: 'COUNCIL', currentGeographyId: '3' } })
      expect(
        wrapper
          .find('SubHeader a')
          .at(2)
          .props().href
      ).toEqual('/council/3')
    })
  })

  describe('with current property app state', () => {
    it('changes lookup link to the selected property', () => {
      const wrapper = setupWrapper({ appState: { currentProperty: '1' } })
      expect(
        wrapper
          .find('SubHeader a')
          .at(1)
          .props().href
      ).toEqual('/property/1')
    })

    it('changes lookup link to the selected property and building', () => {
      const wrapper = setupWrapper({ appState: { currentProperty: '1', currentBuilding: '7' } })
      expect(
        wrapper
          .find('SubHeader a')
          .at(1)
          .props().href
      ).toEqual('/property/1/building/7')
    })
  })
})
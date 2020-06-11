import React from 'react'
import { shallow, mount, render } from 'enzyme';
import ModalActions from '../../components/ModalActions'
import { Provider } from 'react-redux';

import configureMockStore from "redux-mock-store";
const mockStore = configureMockStore();
const store = mockStore({});


jest.mock('../../api/GetApiUrl.js', () => ({
  MY_CONSTANT: 'something fake'
}));

jest.mock('react-native', () => {
  return {
    StyleSheet: {
      create: () => ({}),
    },
  };
});

jest.mock('@fortawesome/react-native-fontawesome', () => ({
    FontAwesomeIcon: ''
}))
jest.mock('react-native-flash-message', () => ({
    FontAwesomeIcon: ''
}))
jest.mock('expo-localization', () => ({
    FontAwesomeIcon: ''
}))
jest.mock('react-native-material-menu', () => ({
    FontAwesomeIcon: ''
}))

describe('ModalActions', () => {
  let wrapper;

  it('Should render.', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('Should have the correct props', () => {
    const wrapper = shallow(<Provider store={store} signal={true}><ModalActions /></Provider>);
    console.log(wrapper.dive())

  });
})

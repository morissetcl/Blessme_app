import React from 'react';
import { Client, Configuration } from 'rollbar-react-native'
import { Text, View, StatusBar } from 'react-native';
import Navigation from './navigation/Navigation';
import FlashMessage from "react-native-flash-message";
import { Provider } from 'react-redux';
import configureStore from './store/store'; //Import the store
const config = new Configuration('429e6867ae2f4d9381cb90125f764e58', {
  logLevel: 'info'
});
const rollbar = new Client(config)

import { enableScreens } from 'react-native-screens';
enableScreens();
;

const store = configureStore();

export default class App extends React.Component {
  render() {
    console.disableYellowBox=true;
    return (
      <Provider store={store}>
        <StatusBar backgroundColor="#49beb7" barStyle="light-content" />
        <View style={{ flex: 1 }}>
          <Navigation/>
          <FlashMessage position="top" />
        </View>
      </Provider>
    );
  }
}

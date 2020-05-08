import React from 'react';
import { Text, View, StatusBar } from 'react-native';
import Navigation from './navigation/Navigation';
import FlashMessage from "react-native-flash-message";
import { Provider } from 'react-redux';
import store from './store/store'; //Import the store
import { enableScreens } from 'react-native-screens';
enableScreens();

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

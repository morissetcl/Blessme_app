import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Navigation from './navigation/Navigation';
import FlashMessage from "react-native-flash-message";
import { Provider } from 'react-redux';
import store from './store/store'; //Import the store

export default class App extends React.Component {
  render() {
    console.disableYellowBox=true;
    return (
      <Provider store={store}>
        <View style={{ flex: 1 }}>
          <Navigation/>
          <FlashMessage position="top" />
        </View>
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 2,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

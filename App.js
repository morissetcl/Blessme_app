import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Navigation from './navigation/Navigation'

export default class App extends React.Component {
  render() {
    return (
      <Navigation/>
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

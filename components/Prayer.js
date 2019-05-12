import React, { Component } from 'react';
import { StyleSheet, View, Text, Button, TouchableOpacity, ActivityIndicator } from 'react-native'
import { getPrayerRequest } from '../api/PrayerRequest'

export default class Prayer extends Component {
  static navigationOptions = { header: null };

  constructor(props) {
    super(props);
    this.state = {
      prayerId: props.navigation.state.params.prayerId,
      loaded: false,
      prayerRequest: []
    }
  }

  componentDidMount() {
    getPrayerRequest(this.state.prayerId).then(data => {
      this.setState({ prayerRequest: data })
      this.setState({ loaded: true })
    })
  }

  render() {
    return (
      <View style={styles.container}>
      { this.state.loaded ?
        <Text>{ this.state.prayerRequest.title }</Text>
        :
        <ActivityIndicator size="large" style = {styles.loader} />
      }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF' // background tab color
  }
})

import React, { Component } from 'react';
import { StyleSheet, View, Text, Button, TouchableOpacity, ActivityIndicator } from 'react-native'
import { getPrayerRequest } from '../api/PrayerRequest'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faPenSquare, faPlusCircle } from '@fortawesome/free-solid-svg-icons'
import PrayerRequestCard from './PrayerRequestCard'

export default class Prayer extends Component {
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
        <View style={styles.prayer_card} >
          <PrayerRequestCard prayer_request={ this.state.prayerRequest } numberOfLines={1000} />
        </View>
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
  },
  loader: {
    color:"#0000ff",
    flex: 1,
    alignItems: 'center',
    position: 'absolute',
    top: 200,
    left: 150
  },
  prayer_card: {
    paddingTop: 20
  }
})

import React, { Component } from 'react';
import { ScrollView, StyleSheet, View, Text, Button, TouchableOpacity, ActivityIndicator } from 'react-native'
import { getPrayerRequest } from '../api/PrayerRequest'
import { getPrayers } from '../api/Prayer'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faPenSquare, faHeart, faMicrophone } from '@fortawesome/free-solid-svg-icons'
import PrayerRequestCard from './PrayerRequestCard'
import PrayerCard from './PrayerCard'
import { NavigationEvents } from 'react-navigation';
import { showMessage, hideMessage } from "react-native-flash-message";

import WritingCommentForm from './form/WritingCommentForm'

export default class Prayer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      prayerId: props.navigation.state.params.prayerId,
      loaded: false,
      prayerRequest: [],
      navigation: props.navigation,
      currentUserEmail: props.navigation.state.params.currentUserEmail,
      prayers: [],
      prayersLoaded: false,
      prayersList: [],
      fromForm: props.navigation.state.params.fromForm
    }
  }


  flashMessageAfterCreate = () => {
    showMessage({
      message: "Votre demande a bien été créée.",
      type: "success"
    });
  };

  componentDidMount() {
    getPrayerRequest(this.state.prayerId).then(data => {
      this.setState({ prayerRequest: data })
      this.setState({ loaded: true })
    })
  }

  retrieveAllPrayers(prayerId) {
    this.setState({ prayersLoaded: true, prayers: [] })
    getPrayers(prayerId).then(data => {
      this.state.prayers.push(data.prayer_request_comments)
      var prayers = this.state.prayers.length > 0 ? this.state.prayers[0] : ['']
      this.state.prayersList = prayers.map((response, index) => {
        return <PrayerCard prayer={ response } key={index} />
      });
      this.setState({ prayersLoaded: true })
    })
  }

  render() {
    return (
      <View style={styles.container}>
      <NavigationEvents onDidFocus={payload => this.retrieveAllPrayers(this.state.prayerId)} />
      { this.state.loaded ?
        <ScrollView>
          <View style={styles.prayer_card} >
            <PrayerRequestCard prayer_request={ this.state.prayerRequest } numberOfLines={1000} />
              { this.state.prayersLoaded ?
                <View style={styles.prayer_list} >
                  { this.state.prayersList }
                </View>
                :
                <ActivityIndicator size="large" style = {styles.loader} />
              }
          </View>
        </ScrollView>
          :
        <ActivityIndicator size="large" style = {styles.loader} />
      }
      { this.state.loaded ?
        <View style = {styles.bottom_buttons}>
          <TouchableOpacity>
            <FontAwesomeIcon icon={ faHeart } size={28} color={ '#49beb7' } />
          </TouchableOpacity>
          <TouchableOpacity>
            <FontAwesomeIcon
              icon={ faPenSquare }
              size={28} color={ '#49beb7' }
              style = {styles.add_prayer}
              onPress={(value) => {
                this.state.navigation.navigate('WritingCommentForm', { prayerRequest: this.state.prayerRequest, currentUserEmail: this.state.currentUserEmail, prayerId: this.state.prayerId })
              }}
             />
          </TouchableOpacity>
          <TouchableOpacity>
            <FontAwesomeIcon icon={ faMicrophone } size={28} color={ '#49beb7' } />
          </TouchableOpacity>
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
    backgroundColor: '#eaeaea' // background tab color
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
  },
  prayer_list: {
    paddingTop: 20,
    paddingBottom: 40
  },
  bottom_buttons: {
    backgroundColor: '#fafafa',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    position: 'absolute',
    bottom:0,
    left:0,
    width: '100%',
    height: '10%',
    alignItems: 'center',
    elevation: 1
  }
})
import React, { Component } from 'react';
import { ScrollView, StyleSheet, View, Text, Button, TouchableOpacity, ActivityIndicator } from 'react-native'
import { getPrayerRequest } from '../api/PrayerRequest'
import { getPrayers } from '../api/Prayer'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faPenSquare, faHeart, faMicrophone } from '@fortawesome/free-solid-svg-icons'
import PrayerRequestCard from './PrayerRequestCard'
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
      flashMessage: true
    }
  }


  componentDidMount() {
    getPrayerRequest(this.state.prayerId).then(data => {
      this.setState({ prayerRequest: data })
      this.setState({ loaded: true })
    })
  }

  componentDidUpdate() {
    if (this.props.navigation.state.params.formFrom && this.state.flashMessage) {
      showMessage({
        message: 'Votre prière a bien été ajoutée.',
        type: 'success',
        icon: 'success'
      });
      this.setState({ flashMessage: false })
    }
  }

  retrieveAllPrayers(prayerId) {
    this.setState({ prayersLoaded: true, prayers: [] })
    getPrayers(prayerId).then(data => {
      this.state.prayers.push(data.prayer_request_comments)
      var prayers = this.state.prayers.length > 0 ? this.state.prayers[0] : ['']
      this.state.prayersList = prayers.map((response, index) => {
        return <View style={styles.comment_card} key={index}>
                 <Text style={styles.username}>{response.user.email}</Text>
                 <Text style={styles.body}>{response.body}</Text>
               </View>
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
  },
  comment_card: {
    padding: '2%',
    marginBottom: '5%',
    backgroundColor: 'white'
  },
  username: {
    fontWeight: 'bold',
    color: '#63686e',
    marginBottom: '2%'
  },
  body: {
    color: '#7d7d7d',
    paddingLeft: '2%'
  }
})

import React, { Component } from 'react';
import { ScrollView, StyleSheet, View, Text, Button, TouchableOpacity, ActivityIndicator } from 'react-native'
import { getPrayerRequest } from '../api/PrayerRequest'
import { getPrayers, destroyPrayers } from '../api/Prayer'
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
      username: props.navigation.state.params.username,
      currentUserEmail: props.navigation.state.params.currentUserEmail,
      prayers: [],
      prayersLoaded: false,
      prayersList: [],
      flashMessage: true,
      numberOfPrayer: ''
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

  goToProfile(email) {
    this.state.navigation.navigate('Profile', { username: this.state.username, userEmail: email })
  }

  destroyActions(commentId, index) {
    destroyPrayers({ prayerId: this.state.prayerId,  commentId: commentId, navigation: this.state.navigation }).then(() => {
      showMessage({
        message: 'Votre prière a bien été supprimée.',
        type: 'success',
        icon: 'success'
      });
      this.retrieveAllPrayers(this.state.prayerId)
    });
  }

  retrieveAllPrayers(prayerId) {
    this.setState({ prayersLoaded: true, prayers: [] })
    getPrayers(prayerId).then(data => {
      this.setState({ numberOfPrayer: data.prayer_request_comments.length })
      this.state.prayers.push(data.prayer_request_comments)
      var prayers = this.state.prayers.length > 0 ? this.state.prayers[0] : ['']
      this.state.prayersList = prayers.map((response, index) => {
        return <View style={styles.comment_card} key={index} id={index}>
                 <Text
                  style={styles.username}
                  onPress={(value) => {
                    this.goToProfile(response.user.email)
                  }}
                  >{response.user.username}</Text>
                 {(response.user.email === this.state.currentUserEmail) ?
                   <View style={styles.actions_button}>
                   <Text
                   style={styles.publish_button}
                   onPress={(value) => {
                     this.state.navigation.navigate('WritingCommentForm', { prayerRequest: this.state.prayerRequest, currentUserEmail: this.state.currentUserEmail, prayerId: this.state.prayerId, body: response.body, commentId: response.id })
                   }}>Modifier</Text>
                   <Text
                   style={styles.delete_button}
                   onPress={(value) => { this.destroyActions(response.id, index) }}>Supprimer</Text>
                   </View>
                   :
                   <Text ></Text>
                 }
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
      { this.state.prayersLoaded ?
        <ScrollView>
          <View style={styles.prayer_card} >
            <PrayerRequestCard prayer_request={ this.state.prayerRequest } numberOfLines={1000} navigation={ this.state.navigation } numberOfPrayer={this.state.numberOfPrayer} />
            <View style={styles.prayer_list} >
              { this.state.prayersList }
            </View>
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
  },
  publish_button: {
    position: 'absolute',
    right: '20%',
    top: '4%',
    color: '#207dff',
    fontWeight: 'bold',
    borderColor: '#207dff',
    borderBottomWidth: 2
  },
  delete_button: {
    position: 'absolute',
    right: '0%',
    top: '4%',
    color: '#207dff',
    fontWeight: 'bold',
    borderColor: '#207dff',
    borderBottomWidth: 2
  },
  actions_button: {
    position: 'relative',
    right: '5%',
    bottom: '67%',
  }
})

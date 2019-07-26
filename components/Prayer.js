import React, { Component } from 'react';
import { ScrollView, StyleSheet, View, Text, Button, TouchableOpacity, ActivityIndicator } from 'react-native'
import { getPrayerRequest } from '../api/PrayerRequest'
import { getPrayers, destroyPrayers } from '../api/Prayer'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faPenSquare, faHeart, faMicrophone, faPlay, faStop, faCog } from '@fortawesome/free-solid-svg-icons'
import PrayerRequestCard from './PrayerRequestCard'
import PrayerRequestButtonsActions from './prayer_request/PrayerRequestButtonsActions'
import { NavigationEvents } from 'react-navigation';
import { showMessage, hideMessage } from "react-native-flash-message";
import WritingCommentForm from './form/WritingCommentForm'
import * as Expo from 'expo'

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
      numberOfPrayer: '',
      soundIsPlaying: false,
      sound:''
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

  playPrayer(audio) {
    if (this.state.soundIsPlaying === false) {
      Expo.Audio.setIsEnabledAsync(true)
      this.setState({ soundIsPlaying: true }, () => {
        const sound = Expo.Audio.Sound.createAsync({ uri: audio }, { shouldPlay: true });
        this.setState({sound: sound});
      });
    } else {
      this.setState({ soundIsPlaying: false }, () => {
        Expo.Audio.setIsEnabledAsync(false)
      });
    }
  }

  retrieveAllPrayers(prayerId) {
    this.setState({ prayersLoaded: true, prayers: [] })
    getPrayers(prayerId).then(data => {
      this.setState({ numberOfPrayer: data.prayer_request_comments.length })
      this.state.prayers.push(data.prayer_request_comments)
      var prayers = this.state.prayers.length > 0 ? this.state.prayers[0] : ['']
      this.state.prayersList = prayers.map((response, index) => {
        const formattedDate = new Date(Date.parse(response.created_at) * 1000);
        const unformattedCreatedDateSince = Date.now() - Date.parse(response.created_at);
        const createdAtSince = Math.floor(unformattedCreatedDateSince/8.64e7);
        const formattedCreatedAtSince = (createdAtSince !== 0) ? `Il y a ${createdAtSince} jours` : "Aujourd'hui"

        return <View style={styles.comment_card} key={index} id={index}>
                 <Text
                  style={styles.username}
                  onPress={(value) => {
                    this.goToProfile(response.user.email)
                  }}
                  >{response.user.username}</Text>
                 {(response.user.email === this.state.currentUserEmail) ?
                   <View style={styles.actions_button}>
                    { !response.audio ?
                     <TouchableOpacity
                       style={styles.publish_button}
                       onPress={(value) => {
                         this.state.navigation.navigate('WritingCommentForm', { prayerRequest: this.state.prayerRequest, currentUserEmail: this.state.currentUserEmail, prayerId: this.state.prayerId, body: response.body, commentId: response.id })
                       }}>
                       <Text style={styles.button_text} >Modifier</Text>
                    </TouchableOpacity>
                    :
                    <Text></Text>
                  }
                    <TouchableOpacity
                     style={styles.delete_button}
                     onPress={(value) => { this.destroyActions(response.id, index) }}>
                      <Text style={styles.button_text}>Supprimer</Text>
                    </TouchableOpacity>
                   </View>
                   :
                   <Text style = {styles.created_at}>{ formattedCreatedAtSince }</Text>
                 }
                 { response.audio ?
                   <View style={styles.playerAudio}>
                     <TouchableOpacity>
                        <FontAwesomeIcon
                          icon={faPlay}
                          size={24}
                          color={ '#49beb7' }
                          onPress={ async() => { this.playPrayer(response.audio)}}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity>
                        <FontAwesomeIcon
                          icon={faStop}
                          size={24}
                          color={ '#49beb7' }
                          onPress={ async() => { this.playPrayer(response.audio)}}
                        />
                      </TouchableOpacity>
                    <Text style={styles.duration} >{response.audio_duration}</Text>
                  </View>
                   :
                   <Text>{response.body}</Text>
                 }
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
        <PrayerRequestButtonsActions prayerRequest={ this.state.prayerRequest } prayerId={ this.state.prayerId } currentUserEmail={ this.state.currentUserEmail } navigation={ this.state.navigation }/>
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
    backgroundColor: '#eaeaea'
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
    paddingBottom: 90
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
    backgroundColor: 'white',
    flex: 1
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
    right: 70,
    top: '4%',
    color: '#207dff',
    fontWeight: 'bold',
    borderColor: '#207dff',
    borderBottomWidth: 2
  },
  delete_button: {
    position: 'absolute',
    right: 0,
    top: '4%',
    fontWeight: 'bold',
    borderColor: '#207dff',
    borderBottomWidth: 2
  },
  button_text: {
    color: '#207dff',
    fontSize: 12
  },
  actions_button: {
    position: 'relative',
    bottom: 27,
    right: 5
  },
  playerAudio: {
    paddingTop: 5,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 40
  },
  duration: {
    color: '#49beb7',
    borderColor: '#49beb7',
    borderRadius: 50,
    borderWidth: 2,
    paddingTop: 3,
    paddingLeft: 6,
    paddingRight: 2,
    position: 'relative',
    bottom: 2,
    fontWeight: 'bold'
  },
  created_at: {
    position:'absolute',
    top: 8,
    right: 12,
    fontSize: 12,
    color: '#bbbbbb'
  }
})

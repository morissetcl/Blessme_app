import React, { Component } from 'react';
import { ScrollView, StyleSheet, View, Text, TouchableOpacity, ActivityIndicator, Dimensions } from 'react-native';
import { getPrayerRequest } from '../api/PrayerRequest';
import { getPrayers, destroyPrayers } from '../api/Prayer';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPenSquare, faMicrophone, faPlay, faStop, faCog } from '@fortawesome/free-solid-svg-icons';
import PrayerRequestCard from './PrayerRequestCard';
import PrayerRequestButtonsActions from './prayer_request/PrayerRequestButtonsActions';
import { NavigationEvents } from 'react-navigation';
import { displayMessage } from "./shared/message";
import WritingCommentForm from './form/WritingCommentForm';
import * as Expo from 'expo';
import AudioPrayer from './AudioPrayer';


export default class Prayer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      prayerId: props.navigation.state.params.prayerId,
      loaded: false,
      prayerRequest: [],
      navigation: props.navigation,
      username: props.navigation.state.params.username,
      currentUserToken: props.navigation.state.params.currentUserToken,
      prayers: [],
      prayersList: [],
      flashMessage: true,
      numberOfPrayer: '',
      prayerRequestUsername: props.navigation.state.params.prayerRequestUsername
    };
  }

  componentDidUpdate() {
    if (this.props.navigation.state.params.formFrom && this.state.flashMessage) {
      displayMessage('Votre prière a bien été ajoutée.', 'success')
      this.setState({ flashMessage: false });
    }
  }

  renderPrayerRequest() {
    if (this.props.navigation.state.params.editedPr) {
      const keyNumber = Math.floor(Math.random() * 100) + 1
      return <PrayerRequestCard
        key={ keyNumber }
        currentUserToken={ this.state.currentUserToken }
        display_modal_action={ true }
        numberOfLines={ 1000 }
        navigation={ this.state.navigation }
        prayerId={ this.props.navigation.state.params.prayerId }
        numberOfPrayer={this.state.numberOfPrayer}
        showView={true} />
    } else {
      return <PrayerRequestCard
        currentUserToken={ this.state.currentUserToken }
        display_modal_action={ true }
        numberOfLines={ 1000 }
        navigation={ this.state.navigation }
        prayerId={ this.props.navigation.state.params.prayerId }
        numberOfPrayer={this.state.numberOfPrayer}
        />
    }
  }

  goToProfile(token) {
    this.state.navigation.navigate('Profile', { username: this.state.username, userToken: token });
  }

  commentFromOriginalPoster(username1, username2) {
    return (username1 == username2)
  }

  destroyActions(commentId, index) {
    destroyPrayers({ prayerId: this.state.prayerId,
      commentId: commentId,
      navigation: this.state.navigation }).then(() => {
        displayMessage('Votre prière a bien été supprimée.', 'success')
        this.retrieveAllPrayers(this.state.prayerId);
    });
  }

  retrieveAllPrayers(prayerId) {
    this.setState({ prayers: [] });
    getPrayers(prayerId).then(data => {
      this.setState({ numberOfPrayer: data.prayer_request_comments.length });
      this.state.prayers.push(data.prayer_request_comments);
      const prayers = this.state.prayers.length > 0 ? this.state.prayers[0] : [''];
      this.state.prayersList = prayers.map((response, index) => {
        const formattedDate = new Date(Date.parse(response.created_at) * 1000);
        const unformattedCreatedDateSince = Date.now() - Date.parse(response.created_at);
        const createdAtSince = Math.floor(unformattedCreatedDateSince/8.64e7);
        const formattedCreatedAtSince = (createdAtSince !== 0) ? `Il y a ${createdAtSince} jours` : "Aujourd'hui";

        return <View style={[this.commentFromOriginalPoster(response.user.username, this.state.prayerRequestUsername) ? styles.comment_card_op : styles.comment_card]} key={response.created_at} id={index}>
          <Text
            style={styles.username}
            onPress={(value) => {
              this.goToProfile(response.user.token);
            }}
          >{response.user.username}</Text>
          {(response.user.token === this.state.currentUserToken) ?
            <View style={styles.actions_button}>
              { !response.audio ?
                <TouchableOpacity
                  style={styles.publish_button}
                  onPress={(value) => {
                    this.state.navigation.navigate('WritingCommentForm', { prayerRequest: this.state.prayerRequest,
                      currentUserToken: this.state.currentUserToken, prayerId: this.state.prayerId,
                      body: response.body, commentId: response.id });
                  }}>
                  <Text style={styles.button_text} >Modifier</Text>
                </TouchableOpacity>
                :
                <Text></Text>
              }
              <TouchableOpacity
                style={styles.delete_button}
                onPress={(value) => { this.destroyActions(response.id, index); }}>
                <Text style={styles.button_text}>Supprimer</Text>
              </TouchableOpacity>
            </View>
            :
            <Text style = {styles.created_at}>{ formattedCreatedAtSince }</Text>
          }
          { response.audio ?
            <View style={styles.playerAudio}>
              <AudioPrayer audio={response.audio} duration={response.audio_duration} />
            </View>
            :
            <Text style={styles.prayerBody}>{response.body}</Text>
          }
        </View>;
      });
      this.setState({ loaded: true });
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <NavigationEvents onDidFocus={payload => this.retrieveAllPrayers(this.state.prayerId)} />
          <ScrollView>
            <View style={styles.prayer_card} >
              { this.renderPrayerRequest() }
              <View style={styles.prayer_list} >
                { this.state.prayersList }
              </View>
            </View>
          </ScrollView>
        { this.state.loaded ?
          <PrayerRequestButtonsActions
            prayerRequest={ this.state.prayerRequest }
            prayerId={ this.state.prayerId }
            currentUserToken={ this.state.currentUserToken }
            navigation={ this.state.navigation }/>
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
    backgroundColor: '#eaeaea',
  },
  loader: {
    color: "#0000ff",
    flex: 1,
    alignItems: 'center',
    position: 'absolute',
    top: Dimensions.get('window').height / 2,
    left: Dimensions.get('window').width / 2,
  },
  prayer_list: {
    paddingTop: 20,
    paddingBottom:  Dimensions.get('window').height / 12,
  },
  comment_card: {
    padding: '2%',
    marginBottom: '2%',
    backgroundColor: 'white',
    flex: 1,
  },
  comment_card_op: {
    padding: '2%',
    marginBottom: '2%',
    backgroundColor: 'white',
    flex: 1,
    borderBottomWidth: 3,
    borderBottomColor: "#ff8b6a"
  },
  username: {
    fontWeight: 'bold',
    color: '#63686e',
    marginBottom: '2%',
  },
  publish_button: {
    position: 'absolute',
    right: 70,
    top: '4%',
    color: '#207dff',
    fontWeight: 'bold',
    borderColor: '#207dff',
    borderBottomWidth: 2,
  },
  delete_button: {
    position: 'absolute',
    right: 0,
    top: '4%',
    fontWeight: 'bold',
    borderColor: '#207dff',
    borderBottomWidth: 2,
  },
  button_text: {
    color: '#207dff',
    fontSize: 12,
  },
  actions_button: {
    position: 'relative',
    bottom: 27,
    right: 5,
  },
  playerAudio: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
    marginLeft: '5%',
    marginRight: '5%',
    width: '90%',
  },
  created_at: {
    position: 'absolute',
    top: 8,
    right: 12,
    fontSize: 12,
    color: '#bbbbbb',
  },
  prayerBody: {
    marginTop: 5
  }
});

import React, { Component } from 'react';
import { ScrollView, StyleSheet, View, Text, TouchableOpacity, ActivityIndicator, Dimensions, Alert } from 'react-native';
import { getPrayerRequest } from '../api/PrayerRequest';
import { getPrayers, destroyPrayers } from '../api/Prayer';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPenSquare, faTrash } from '@fortawesome/free-solid-svg-icons';
import PrayerRequestCard from './PrayerRequestCard';
import PrayerRequestButtonsActions from './prayer_request/PrayerRequestButtonsActions';
import { NavigationEvents } from 'react-navigation';
import { displayMessage } from "./shared/message";
import WritingCommentForm from './form/WritingCommentForm';
import * as Expo from 'expo';
import AudioPrayer from './AudioPrayer';
import * as Localization from 'expo-localization';
import i18n from 'i18n-js';

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
      prayerRequestUsername: props.navigation.state.params.prayerRequestUsername
    };
  }

  componentDidUpdate() {
    const success = i18n.t('success', { defaultValue: 'Prayer added' })
    if (this.props.navigation.state.params.formFrom && this.state.flashMessage) {
      displayMessage(success, 'success')
      this.setState({ flashMessage: false });
    }
  }

  _showAlert = (responId, index) => {
    Alert.alert(
      this.state.title,
      i18n.t('areYouSurePr', { defaultValue: 'Are you sure ?' }),
      [
        {text: i18n.t('delete', { defaultValue: 'Delete' }), onPress: () => this.destroyActions(responId, index)},
        {text: i18n.t('cancel', { defaultValue: 'Cancel' }), onPress: () => console.log('')}
      ],
      { onDismiss: () => {} }
    )
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
        showView={true} />
    } else {
      return <PrayerRequestCard
        currentUserToken={ this.state.currentUserToken }
        display_modal_action={ true }
        numberOfLines={ 1000 }
        navigation={ this.state.navigation }
        prayerId={ this.props.navigation.state.params.prayerId }
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
    const destroyPrayer = i18n.t('destroyPrayer', { defaultValue: 'Prayer deleted' })
    destroyPrayers({ prayerId: this.state.prayerId,
      commentId: commentId,
      navigation: this.state.navigation }).then(() => {
        displayMessage(destroyPrayer, 'success')
        this.retrieveAllPrayers(this.state.prayerId);
    });
  }

  retrieveAllPrayers(prayerId) {
    this.setState({ prayers: [] });
    getPrayers(prayerId).then(data => {
      this.state.prayers.push(data.prayer_request_comments);
      const prayers = this.state.prayers.length > 0 ? this.state.prayers[0] : [''];
      this.state.prayersList = prayers.map((response, index) => {
        const formattedDate = new Date(Date.parse(response.created_at) * 1000);
        const unformattedCreatedDateSince = Date.now() - Date.parse(response.created_at);
        const createdAtSince = Math.floor(unformattedCreatedDateSince/8.64e7);
        const trad = i18n.t('prayerDate', { createdAtSince: createdAtSince, defaultValue: '-' })

        const formattedCreatedAtSince = (createdAtSince !== 0) ? trad : i18n.t('today', { defaultValue: 'Today' });

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
                  <FontAwesomeIcon
                    icon={ faPenSquare }
                    size={18} color={ '#bbbbbb' }
                  />
                </TouchableOpacity>
                :
                <Text></Text>
              }
              <TouchableOpacity
                style={styles.delete_button}
                onPress={(value) => { this._showAlert(response.id, index); }}>
                <FontAwesomeIcon
                  icon={ faTrash }
                  size={16} color={ '#bbbbbb' }
                />
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
    i18n.locale = Localization.locale;
    i18n.fallbacks = true;

    i18n.translations = {
      fr: {
            success: 'Votre prière a bien été ajoutée.',
            edit: 'Modifier',
            delete: 'Supprimer',
            destroyPrayer: 'Votre prière a bien été supprimée.',
            prayerDate: "Il y a {{ createdAtSince }} jours",
            today: "Aujourd'hui",
            areYouSurePr: 'Supprimer votre prière ?'
          },
      en: {
            success: 'Yous prayer has been added.',
            edit: 'Edit',
            delete: 'Delete',
            cancel: 'Cancel',
            destroyPrayer: 'Your prayer has been removed.',
            prayerDate: "{{ createdAtSince }} days ago",
            today: "Today",
            areYouSurePr: 'Remove you prayer ?'
          }
    };

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
    right: 30,
    top: '4%',
    color: '#207dff',
  },
  delete_button: {
    position: 'absolute',
    right: 0,
    top: '4%',
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

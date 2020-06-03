import React, { Component } from 'react';
import { ScrollView, StyleSheet, View, Text, TouchableOpacity,
  ActivityIndicator, Alert } from 'react-native';
import { getPrayerRequest } from '../../../api/PrayerRequest';
import { getPrayers, destroyPrayers } from '../../../api/Prayer';
import { createInnapropriateContent } from '../../../api/InnapropriateContent';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPenSquare, faTrash, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import PrayerRequestCard from '../../PrayerRequestCard';
import PrayerRequestButtonsActions from '../../prayer_request/PrayerRequestButtonsActions';
import { NavigationEvents } from 'react-navigation';
import { displayMessage } from "../../shared/message";
import WritingComment from '../../form/WritingComment/WritingComment';
import * as Expo from 'expo';
import AudioPrayer from '../audio/Prayer';
import * as Localization from 'expo-localization';
import i18n from 'i18n-js';
import { styles } from './Styles'

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
      prayerRequestUsername: props.navigation.state.params.prayerRequestUsername,
    };
  }

  componentDidUpdate() {
    const success = i18n.t('success', { defaultValue: 'Prayer added' });
    if (this.props.navigation.state.params.formFrom && this.state.flashMessage) {
      displayMessage(success, 'success');
      this.setState({ flashMessage: false });
    }
  }

  _showAlert = (responId, index) => {
    Alert.alert(
      this.state.title,
      i18n.t('areYouSurePr', { defaultValue: 'Êtes-vous sûr ?' }),
      [
        { text: i18n.t('delete', { defaultValue: 'Supprimer' }), onPress: () => this.destroyActions(responId, index) },
        { text: i18n.t('cancel', { defaultValue: 'Annuler' }), onPress: () => console.log('') },
      ],
      { onDismiss: () => {} },
    );
  }

  renderPrayerRequest() {
    if (this.props.navigation.state.params.editedPr) {
      const keyNumber = Math.floor(Math.random() * 100) + 1;
      return <PrayerRequestCard
        displayDeleteAction={true}
        key={ keyNumber }
        currentUserToken={ this.state.currentUserToken }
        numberOfLines={ 1000 }
        navigation={ this.state.navigation }
        prayerId={ this.props.navigation.state.params.prayerId }
        showView={true} />;
    } else {
      return <PrayerRequestCard
        displayDeleteAction={true}
        currentUserToken={ this.state.currentUserToken }
        numberOfLines={ 1000 }
        navigation={ this.state.navigation }
        prayerId={ this.props.navigation.state.params.prayerId }
      />;
    }
  }

  goToProfile(token) {
    this.state.navigation.navigate('Profile', { username: this.state.username, userToken: token });
  }

  commentFromOriginalPoster(username1, username2) {
    return (username1 === username2);
  }

  destroyActions(commentId, index) {
    const destroyPrayer = i18n.t('destroyPrayer', { defaultValue: 'Prière supprimée' });
    destroyPrayers({ prayerId: this.state.prayerId,
      commentId: commentId,
      navigation: this.state.navigation }).then(() => {
      displayMessage(destroyPrayer, 'success');
      this.retrieveAllPrayers(this.state.prayerId);
    });
  }

  signalContent(alertableId) {
    const trad = i18n.t('signalSuccess', { defaultValue: 'Signalé avec succès' });
    createInnapropriateContent({
      alertableId: alertableId,
      object: 'prayer'
    })
    displayMessage(trad, 'success');
  }

  retrieveAllPrayers(prayerId) {
    this.setState({ prayers: [] });
    getPrayers(prayerId).then(data => {
      this.state.prayers.push(data.prayer_request_comments);
      const prayers = this.state.prayers.length > 0 ? this.state.prayers[0] : [''];
      const prayersList = prayers.map((response, index) => {
        const formattedDate = new Date(Date.parse(response.created_at) * 1000);
        const unformattedCreatedDateSince = Date.now() - Date.parse(response.created_at);
        const createdAtSince = Math.floor(unformattedCreatedDateSince/8.64e7);
        const trad = i18n.t('prayerDate', { createdAtSince: createdAtSince, defaultValue: '-' });

        const formattedCreatedAtSince = (createdAtSince !== 0) ? trad : i18n.t('today', { defaultValue: 'Today' });

        return <View

          style={[this.commentFromOriginalPoster(response.user.username,
            this.state.prayerRequestUsername) ? styles.commentCardOp : styles.commentCard]}
          key={response.created_at}
          id={index}
          >

          <TouchableOpacity
            onLongPress={(value) => {
              this.signalContent(response.id);
            }}
          >
          <Text
            style={styles.username}
            onPress={(value) => {
              this.goToProfile(response.user.token);
            }}
          >{response.user.username}</Text>
          {(response.user.token === this.state.currentUserToken) ?
            <View style={styles.actionsButton}>
              { !response.audio ?
                <TouchableOpacity
                  style={styles.publishButton}
                  onPress={(value) => {
                    this.state.navigation.navigate('WritingComment', { prayerRequest: this.state.prayerRequest,
                      currentUserToken: this.state.currentUserToken, prayerId: this.state.prayerId,
                      body: response.body, commentId: response.id });
                  }}>
                  <FontAwesomeIcon
                    icon={ faPenSquare }
                    size={18} color={ '#bbbbbb' }
                  />
                </TouchableOpacity>
                :
                null
              }
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={(value) => {
                  this._showAlert(response.id, index);
                }}>
                <FontAwesomeIcon
                  icon={ faTrash }
                  size={16} color={ '#bbbbbb' }
                />
              </TouchableOpacity>
            </View>
            :
            <Text style = {styles.createdAt}>{ formattedCreatedAtSince }</Text>
          }
          { response.audio ?
            <View style={styles.playerAudio}>
              <AudioPrayer audio={response.audio} duration={response.audio_duration} />
            </View>
            :
            <Text style={styles.prayerBody}>{response.body}</Text>
          }
          </TouchableOpacity>

        </View>;
      });
      this.setState({ prayersList: prayersList });
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
        areYouSurePr: 'Supprimer votre prière ?',
      },
      en: {
        success: 'Yous prayer has been added.',
        edit: 'Edit',
        delete: 'Delete',
        cancel: 'Cancel',
        destroyPrayer: 'Your prayer has been removed.',
        prayerDate: "{{ createdAtSince }} days ago",
        today: "Today",
        areYouSurePr: 'Remove you prayer ?',
      },
    };

    return (
      <View style={styles.container}>
        <NavigationEvents onDidFocus={payload => this.retrieveAllPrayers(this.state.prayerId)} />
        <ScrollView>
          <View style={styles.prayerCard} >
            { this.renderPrayerRequest() }
            <View style={styles.prayerList} >
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

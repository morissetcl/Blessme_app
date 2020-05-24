import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Alert } from 'react-native';
import { destroyPrayerResquest, signalPrayerRequest } from '../api/PrayerRequest';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import { displayMessage } from "./shared/message";
import * as Localization from 'expo-localization';
import i18n from 'i18n-js';

export default class ModalActions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUserToken: props.currentUserToken,
      navigation: props.navigation,
      body: props.body,
      title: props.title,
      category: props.category,
      prayerRequestId: props.prayerId,
    };
  }

  _deletePrayerRequest = () => {
    const trad = i18n.t('deleteSuccess', { defaultValue: 'Deleted' });
    destroyPrayerResquest({
      prayerRequestId: this.state.prayerRequestId,
      navigation: this.state.navigation }).then(() => {
      displayMessage(trad, 'success');
    });
  }

  _signalPrayerRequest = () => {
    const trad = i18n.t('signalSuccess', { defaultValue: 'Signalée avec succès' });
    signalPrayerRequest({
      navigation: this.state.navigation,
      prayerRequestId: this.state.prayerRequestId,
      object: 'prayer_request'
    })
    displayMessage(trad, 'success');
  }

  _goToPrayerRequest = () => {
    this.state.navigation.navigate('PrayerRequest', {
      currentUserToken: this.state.currentUserToken,
      body: this.state.body,
      title: this.state.title,
      category: this.state.category,
      username: this.state.username,
      editPrayer: true,
      prayerRequestId: this.state.prayerRequestId,
    });
  }

  ownerActions() {
    return [
             { text: i18n.t('delete', { defaultValue: 'Supprimer' }), onPress: () => this._deletePrayerRequest() },
             { text: i18n.t('edit', { defaultValue: 'Modifier' }), onPress: () => this._goToPrayerRequest() },
             { text: i18n.t('cancel', { defaultValue: 'Annuler' }), onPress: () => console.log('') },
           ]
  }

  notOwnerActions() {
    return [
             { text: i18n.t('signal', { defaultValue: 'Signaler' }), onPress: () => this._signalPrayerRequest() },
             { text: i18n.t('cancel', { defaultValue: 'Annuler' }), onPress: () => console.log('') }
           ]
  }

  returnActions() {
    return this.props.currentUserIstheOwner ? this.ownerActions() : this.notOwnerActions();
  }

  _showAlert = () => {
    Alert.alert(
      this.state.title,
      i18n.t('areYouSurePr', { defaultValue: 'Que voulez vous faire avec cette demande ?' }),
      this.returnActions(),
      { onDismiss: () => {} },
    );
  }

  render() {
    i18n.locale = Localization.locale;
    i18n.fallbacks = true;

    i18n.translations = {
      fr: {
        signalSuccess: 'Merci, nos équipes vont contrôler le contenu.',
        areYouSurePr: 'Que voulez vous faire avec cette demande ?',
        edit: 'Modifier',
        delete: 'Supprimer',
        cancel: 'Annuler',
        deleteSuccess: 'Votre demande a bien été supprimée.',
      },
      en: {
        signalSuccess: 'Thanks for the report. We are going to check.',
        areYouSurePr: 'What do you want to do ?',
        edit: 'Edit',
        delete: 'Remove',
        cancel: 'Cancel',
        deleteSuccess: 'Prayer request deleted with success.',
      },
    };

    return (
      <TouchableOpacity
        onPress={this._showAlert}
        style = {styles.menu} >
        <FontAwesomeIcon icon={ faEllipsisV } size={16} color={ '#bbbbbb' }/>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  menu: {
    position: 'absolute',
    top: 8,
    right: 0,
  },
});

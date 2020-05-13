import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Alert } from 'react-native';
import { destroyPrayerResquest } from '../api/PrayerRequest';
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

  _showAlert = () => {
    Alert.alert(
      this.state.title,
      i18n.t('areYouSurePr', { defaultValue: 'Que voulez vous faire avec cette demande ?' }),
      [
        { text: i18n.t('delete', { defaultValue: 'Supprimer' }), onPress: () => this._deletePrayerRequest() },
        { text: i18n.t('edit', { defaultValue: 'Modifier' }), onPress: () => this._goToPrayerRequest() },
        { text: i18n.t('cancel', { defaultValue: 'Annuler' }), onPress: () => console.log('') },
      ],
      { onDismiss: () => {} },
    );
  }

  render() {
    i18n.locale = Localization.locale;
    i18n.fallbacks = true;

    i18n.translations = {
      fr: {
        areYouSurePr: 'Que voulez vous faire avec cette demande ?',
        edit: 'Modifier',
        delete: 'Supprimer',
        cancel: 'Annuler',
        deleteSuccess: 'Votre demande a bien été supprimée.',
      },
      en: {
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

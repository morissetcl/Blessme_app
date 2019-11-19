import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Alert } from 'react-native';
import { destroyPrayerResquest } from '../api/PrayerRequest';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import { displayMessage } from "./shared/message";

export default class ModalActions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      prayerRequest: props.prayerRequest,
      navigation: props.navigation
    };
  }

  _deletePrayerRequest = () => {
    destroyPrayerResquest({
      prayerRequestId: this.state.prayerRequest.id,
      navigation: this.state.navigation }).then(() => {
        displayMessage('Votre demande a bien été supprimée.', 'success')
    });
  }

  _goToPrayerRequestForm = () => {
    this.state.navigation.navigate('PrayerRequestForm', { currentUserEmail: this.state.currentUserEmail,  prayerRequest: this.state.prayerRequest, editPrayer: true });
  }

  _showAlert = () => {
    Alert.alert(
      this.state.title,
      'Que voulez vous faire avec cette demande ?',
      [
        {text: 'Modifier', onPress: () => this._goToPrayerRequestForm()},
        {text: '', onPress: () => alert('')},
        {text: 'Supprimer', onPress: () => this._deletePrayerRequest()}
      ],
      { onDismiss: () => {} }
    )
  }

  render() {
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
  }
});

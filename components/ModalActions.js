import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Alert } from 'react-native';
import { destroyPrayerResquest } from '../api/PrayerRequest';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import { showMessage } from "react-native-flash-message";

export default class Prayer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      prayerRequestId: props.prayerRequestId,
      navigation: props.navigation
    };
  }

  _deletePrayerRequest = () => {
    destroyPrayerResquest({
      prayerRequestId: this.state.prayerRequestId,
      navigation: this.state.navigation }).then(() => {
      showMessage({
        message: 'Votre demande a bien été supprimée.',
        type: 'success',
        icon: 'success',
      });
    });
  }

  _showAlert = () => {
    Alert.alert(
      this.state.title,
      'Que voulez vous faire avec cette demande ?',
      [
        {text: 'Modifier', onPress: () => alert('Ask me later pressed')},
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

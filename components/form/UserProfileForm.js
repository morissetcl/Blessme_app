import React, { Component } from 'react';
import { TouchableHighlight, TextInput, StyleSheet, View,
  Text, Button, TouchableOpacity, ActivityIndicator, Picker, ScrollView, Alert } from 'react-native';
import { displayMessage } from "../shared/message";
import { updateUser } from '../../api/User';
import * as firebase from "firebase";
import * as Localization from 'expo-localization';
import i18n from 'i18n-js';

export default class UserProfileForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: props.navigation.state.params.email,
      username: props.navigation.state.params.username,
      avatarUrl: props.navigation.state.params.avatarUrl,
      biography: props.navigation.state.params.biography,
      navigation: props.navigation
    };
  }

  editUser(email, avatar, username) {
    const success = i18n.t('success', { defaultValue: 'Informations edited' })
    const fail = i18n.t('fail', { defaultValue: 'Please fill everything' })

    if (this.state.username) {
      updateUser({ email: this.state.email,
        username: this.state.username,
        biography: this.state.biography,
        navigation: this.props.navigation
      });
      displayMessage(success, 'success')
    } else {
      displayMessage(fail, 'warning')
    }
  }

  signOut() {
    return (
      <TouchableOpacity>
        <FontAwesomeIcon icon={faSignOutAlt}
          size={16} color={ "#bbbbbb" }
          onPress={() => this.goToEditUser()}
          />
      </TouchableOpacity>
    )
  }

  modalAlert() {
    Alert.alert(
    i18n.t('signOut', { defaultValue: 'Sign out' }),
      i18n.t('areYouSure', { defaultValue: 'Sure ?' }),
      [
        {
          text: i18n.t('cancel', { defaultValue: 'Cancel' }),
          style: 'cancel',
          onPress: () => console.log('cancel pressed')
        },
        { text: i18n.t('yes'),
          onPress: () => this.state.navigation.navigate('Connexion', { signOut: true })
        }
      ]
    );
  }

  render() {
    i18n.locale = Localization.locale;
    i18n.fallbacks = true;

    i18n.translations = {
      fr: {
            success: 'Vos informations ont bien été modifié.',
            fail: 'Merci de remplir tous les champs pour modifier vos informations.',
            signOut: 'Vous allez être déconnecté',
            areYouSure: 'Ëtes vous sûr ?',
            cancel: 'Annuler',
            yes: 'Oui',
            about: 'Écrivez un petit mot sur vous.',
            edit: 'Modifier',
            username: 'Pseudonyme',
            aboutLabel: 'Un petit mot sur vous',
            signOutButton: 'Déconnexion'
          },
      en: {
            success: 'Yous informations has been edited.',
            fail: 'Please fill all required fields.',
            signOut: 'You are going to be sign out',
            areYouSure: 'Are your sure ?',
            cancel: 'Cancel',
            yes: 'Yes',
            about: 'Add some details about you.',
            edit: 'Edit',
            username: 'Username',
            aboutLabel: 'Tell more about you',
            signOutButton: 'Sign out'
          }
    };
    return (
      <View style={styles.container} >
        <TouchableOpacity style={styles.publish_button}
          onPress={(value) => { this.editUser(); }}>
          <Text style={styles.button_text}>{ i18n.t('edit', { defaultValue: 'Edit' }) }</Text>
        </TouchableOpacity>
        <Text style={styles.title_input} >{ i18n.t('username', { defaultValue: 'Username' }) }</Text>
        <TextInput
          inputStyle={{ width: '100%', color: 'black', backgroundColor: 'red' }}
          underlineColorAndroid="transparent"
          multiline
          value={this.state.username}
          onChangeText={(username) => this.setState({ username })}
          style={styles.input}
        />
        <Text style={styles.title_input} >{ i18n.t('aboutLabel', { defaultValue: 'About you' }) }</Text>
        <TextInput
          placeholder={ i18n.t('about') }
          inputStyle={{ width: '100%', color: 'black' }}
          underlineColorAndroid="transparent"
          multiline
          value={this.state.biography}
          onChangeText={(biography) => this.setState({ biography })}
          style={styles.input}
        />
        <TouchableOpacity style={styles.signout_button}
          onPress={() => this.modalAlert()}>
          <Text style={styles.button_text}>{ i18n.t('signOutButton', { defaultValue: 'Sign out' }) }</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  publish_button: {
    position: 'absolute',
    right: '10%',
    top: '4%',
    color: '#207dff',
    fontWeight: 'bold',
    borderColor: '#207dff',
    borderBottomWidth: 2,
  },
  signout_button: {
    position: 'absolute',
    left: '10%',
    bottom: '4%',
    color: '#207dff',
    fontWeight: 'bold',
    borderColor: '#207dff',
    borderBottomWidth: 2,
  },
  divider: {
    backgroundColor: '#dee0d9',
    width: '90%',
    height: 1,
    marginLeft: '5%',
    marginTop: 30,
    marginBottom: 10
  },
  input: {
    padding: 5,
    marginTop: 10,
    marginLeft: '5%',
    marginRight: '5%',
    backgroundColor: '#f5f5f5'
  },
  title_input: {
    marginTop: 10,
    marginLeft: '5%',
    marginRight: '5%',
    fontWeight: 'bold'
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: 30
  },
  button_text: {
    color: '#207dff',
  },
  pickerTitle: {
    marginBottom: 10,
    color: '#d3d3d3'
  }
});

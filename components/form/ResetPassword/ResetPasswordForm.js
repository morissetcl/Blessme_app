import React, { Component } from 'react';
import { TouchableHighlight, TextInput, StyleSheet, View, Text,
  Button, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Item, Form, Input, Label } from "native-base";
import { displayMessage } from "../../shared/message";
import * as Localization from 'expo-localization';
import i18n from 'i18n-js';
import { styles } from './Styles'

export default class ResetPasswordForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
    };
  }

  resetPassword(email) {
    const emailSent = i18n.t('emailSent', { defaultValue: 'Email sent' });
    const userNotFound = i18n.t('userNotFound', { defaultValue: 'User not found' });

    const emailAddress = "clement.morisset@yahoo.fr";
    this.props.navigation.state.params.firebase.sendPasswordResetEmail(email).then(function () {
      displayMessage(emailSent, 'success');
    }).catch(function (error) {
      switch (error.code) {
        case 'auth/invalid-email':
          displayMessage(userNotFound, 'warning');
      }
    });
  }

  render() {
    i18n.locale = Localization.locale;
    i18n.fallbacks = true;

    i18n.translations = {
      fr: {
        emailSent: 'Un email vous a été envoyé pour réinitialiser votre mot de passe.',
        userNotFound: 'Aucun utilisateur trouvé, veuillez vérifier votre email.',
        reinitialize: 'Réinitialiser',
        email: 'Email',
      },
      en: {
        emailSent: 'You will receive an email in few minutes',
        userNotFound: 'Email not found, please check again.',
        reinitialize: 'Reset',
        email: 'Email',
      },
    };

    return (
      <View style={styles.form_wrapper}>
        <Form>
          <Item floatingLabel>
            <Label>{ i18n.t('email', { defaultValue: 'Email' }) }</Label>
            <Input
              autoCapitalize="none"
              autoCorrect={false}
              onChangeText={email => this.setState({ email: email })}
            />
          </Item>
        </Form>
        <View style={styles.boutons_wrapper}>
          <TouchableOpacity style={styles.bouton} onPress={() => this.resetPassword(this.state.email)} >
            <Text style={{ color: 'white' }}>{ i18n.t('reinitialize', { defaultValue: 'Reset' })}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

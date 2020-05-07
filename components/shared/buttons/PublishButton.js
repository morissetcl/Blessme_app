import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, Text, View } from 'react-native';
import * as Localization from 'expo-localization';
import i18n from 'i18n-js';

export default class PublishButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      buttonType: this.buttonType(),
    };
  }

  buttonType() {
    return this.props.buttonType ? this.props.buttonType : 'Publier';
  }

  render() {
    i18n.locale = Localization.locale;
    i18n.fallbacks = true;

    i18n.translations = {
      fr: {
        edit: 'Modifier',
        publish: 'Publier',
        signOut: 'Déconnexion',
      },
      en: {
        edit: 'Edit',
        publish: 'Publish',
        signOut: 'Sign out',
      },
    };
    return (
      <TouchableOpacity style={styles.publishButton} onPress={this.props.onPress}>
        <Text style={styles.button_text}>
          { i18n.t(this.state.buttonType, { defaultValue: this.state.buttonType }) }
        </Text>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  publishButton: {
    color: '#207dff',
    fontWeight: 'bold',
    borderColor: '#207dff',
    borderBottomWidth: 2,
  },
  button_text: {
    color: '#207dff',
  },
});

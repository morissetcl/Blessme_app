import React, { Component } from 'react';
import { TouchableHighlight, TextInput, StyleSheet, View,
  Text, Button, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Input, Divider } from 'react-native-elements';
import { createPrayer, editPrayer } from '../../../api/Prayer';
import { displayMessage } from "../../shared/message";
import * as Localization from 'expo-localization';
import i18n from 'i18n-js';
import PublishButton from '../../shared/buttons/PublishButton';
import { styles } from './Styles'

export default class WritingCommentForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      prayerTitle: props.navigation.state.params.prayerRequest.title,
      currentUserToken: props.navigation.state.params.currentUserToken,
      prayerId: props.navigation.state.params.prayerId,
      body: props.navigation.state.params.body,
      editPrayer: props.navigation.state.params.body,
      commentId: props.navigation.state.params.commentId,
    };
  }

  addPrayer(prayerId) {
    const fail = i18n.t('fail');
    const created = i18n.t('created', { defaultValue: 'Prayer created.' });

    if (this.state.body) {
      createPrayer({ currentUserToken: this.state.currentUserToken,
        body: this.state.body,
        prayerId: this.state.prayerId,
        navigation: this.props.navigation });
      displayMessage(created, 'success');
    } else {
      displayMessage(fail, 'warning');
    }
  }

  editrayer(prayerId) {
    const fail = i18n.t('fail', { defaultValue: 'Please fill everything.' });
    const success = i18n.t('success', { defaultValue: 'Prayer edited.' });

    if (this.state.body) {
      editPrayer({ currentUserToken: this.state.currentUserToken,
        body: this.state.body,
        prayerId: this.state.prayerId,
        navigation: this.props.navigation,
        commentId: this.state.commentId });
      displayMessage(success, 'success');
    } else {
      displayMessage(fail, 'warning');
    }
  }

  render() {
    i18n.locale = Localization.locale;
    i18n.fallbacks = true;

    i18n.translations = {
      fr: {
        fail: 'Merci de remplir tous les champs pour ajouter votre prière.',
        success: 'Votre prière a bien été modifiée.',
        created: 'Votre prière a bien été créée.',
        edit: 'Modifier',
        publish: 'Publier',
        placeholder: 'Écrivez votre prière..',
      },
      en: {
        fail: 'Please fill all required fields.',
        success: 'Prayer successfully updated.',
        created: 'Prayer successfully created.',
        edit: 'Edit',
        publish: 'Publish',
        placeholder: 'Write you prayer..',
      },
    };

    const bodyEdition = this.state.body ? this.state.body : '';
    return (
      <View style={styles.container} >
        <Text style={styles.prayer_title} >{ this.state.prayerTitle }</Text>
        <View style={styles.positionPublishButton} >
          { this.state.editPrayer ?
            <PublishButton onPress={ () => this.editrayer(this.state.prayerId) } buttonType={'edit'} />
            :
            <PublishButton onPress={ () => this.addPrayer(this.state.prayerId) } />
          }
        </View>
        <Divider style={styles.divider} />
        <TextInput
          placeholder={ i18n.t('placeholder', { defaultValue: 'Your prayer..' }) }
          inputStyle={{ width: '100%', color: 'black' }}
          underlineColorAndroid="transparent"
          multiline
          value={bodyEdition}
          onChangeText={(body) => this.setState({ body })}
          style={styles.comment_input}
        />
      </View>
    );
  }
}

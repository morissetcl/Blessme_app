import React, { Component } from 'react';
import { TouchableHighlight, TextInput, StyleSheet, View,
  Text, Button, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Input, Divider } from 'react-native-elements';
import { createPrayer, editPrayer } from '../../api/Prayer';
import { displayMessage } from "../shared/message";
import * as Localization from 'expo-localization';
import i18n from 'i18n-js';

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
    const fail = i18n.t('fail')
    const created = i18n.t('created', { defaultValue: 'Prayer created.' })

    if (this.state.body) {
      createPrayer({ currentUserToken: this.state.currentUserToken,
        body: this.state.body,
        prayerId: this.state.prayerId,
        navigation: this.props.navigation });
      displayMessage(created, 'success')
    } else {
      displayMessage(fail, 'warning')
    }
  }

  editrayer(prayerId) {
    const fail = i18n.t('fail', { defaultValue: 'Please fill everything.' })
    const success = i18n.t('success', { defaultValue: 'Prayer edited.' })

    if (this.state.body) {
      editPrayer({ currentUserToken: this.state.currentUserToken,
        body: this.state.body,
        prayerId: this.state.prayerId,
        navigation: this.props.navigation,
        commentId: this.state.commentId });
      displayMessage(success, 'sucess')
    } else {
      displayMessage(fail, 'warning')
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
            placeholder: 'Écrivez votre prière..'
          },
      en: {
            fail: 'Please fill all required fields.',
            success: 'Prayer sucessfully updated.',
            created: 'Prayer sucessfully created.',
            edit: 'Edit',
            publish: 'Publish',
            placeholder: 'Write you prayer..'
          }
    };

    const bodyEdition = this.state.body ? this.state.body : '';
    return (
      <View style={styles.container} >
        <Text style={styles.prayer_title} >{ this.state.prayerTitle }</Text>
        { this.state.editPrayer ?
          <TouchableOpacity style={styles.publish_button}
            onPress={(value) => { this.editrayer(this.state.prayerId); }}>
            <Text style={styles.button_text}>{ i18n.t('edit', { defaultValue: 'Edit' }) }</Text>
          </TouchableOpacity>
          :
          <TouchableOpacity style={styles.publish_button}
            onPress={(value) => { this.addPrayer(this.state.prayerId); }}>
            <Text style={styles.button_text}>{ i18n.t('publish', { defaultValue: 'Publish' }) }</Text>
          </TouchableOpacity>

        }
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
  divider: {
    backgroundColor: '#dee0d9',
    width: '90%',
    height: 1,
    marginLeft: '5%',
    position: 'relative',
    top: 30
  },
  prayer_title: {
    textAlign: 'justify',
    paddingRight: '30%',
    paddingLeft: 10,
    paddingTop: 20,
    fontWeight: 'bold',
  },
  comment_input: {
    marginTop: 50,
    marginLeft: 10,
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  button_text: {
    color: '#207dff',
  },
});

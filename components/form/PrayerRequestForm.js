import React, { Component } from 'react';
import { TouchableHighlight, TextInput, StyleSheet, View,
  Text, Button, TouchableOpacity, ActivityIndicator, Picker, ScrollView, KeyboardAvoidingView } from 'react-native';
import { Input, Divider, ButtonGroup } from 'react-native-elements';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPenSquare, faMicrophone } from '@fortawesome/free-solid-svg-icons';
import { createPrayerRequestAndRedirect, retrievePrayerRequestId, editPrayerRequest } from '../../api/PrayerRequest';
import { displayMessage } from "../shared/message";
import { getCategories } from '../../api/Category';
import { NavigationEvents } from 'react-navigation';

import PublishButton from '../shared/buttons/PublishButton';

import * as Localization from 'expo-localization';
import i18n from 'i18n-js';

export default class PrayerRequestForm extends Component {
  constructor(props) {
    super(props);
    const params = props.navigation.state.params;
    this.state = {
      username: params.username,
      currentUserToken: params.token,
      editPrayer: params.editPrayer,
      body: params.body,
      title: params.title,
      prCategory: params.category,
      prayerRequestId: params.prayerRequestId,
      categories: [],
      selectedIndex: undefined,
      loaded: false,
    };
  }

  addPrayerRequest() {
    const firstRowCategory = this.state.categories.slice(0, 6);
    if (this.state.title && this.state.body) {
      createPrayerRequestAndRedirect({ username: this.state.username,
        currentUserToken: this.state.currentUserToken,
        body: this.state.body,
        title: this.state.title,
        category: firstRowCategory[this.state.selectedIndex],
        navigation: this.props.navigation,
      });
      displayMessage(i18n.t('prAdded', { defaultValue: 'Prayer request added.' }), 'success');
    } else {
      displayMessage(i18n.t('missingField'), 'warning');
    }
  }

  prayerRequestUpdate(prayerRequestId) {
    const firstRowCategory = this.state.categories.slice(0, 6);
    if (this.state.title && this.state.body) {
      editPrayerRequest({ currentUserToken: this.state.currentUserToken,
        title: this.state.title,
        body: this.state.body,
        prayerRequestId: this.state.prayerRequestId,
        navigation: this.props.navigation,
        category: firstRowCategory[this.state.selectedIndex],
      });
      displayMessage(i18n.t('prEdited', { defaultValue: 'Prayer request updated.' }), 'success');
    } else {
      displayMessage(i18n.t('missingField', { defaultValue: 'Please fill everything.' }), 'warning');
    }
  }

  componentDidMount() {
    this.displayCategories();
  }

  displayCategories() {
    getCategories().then(data => {
      this.setState({ categories:
         data.categories.map((response, index) => {
           const french = i18n.locale === 'fr-FR';
           return french ? response.label : response.translation;
         }),
      loaded: true,
      });
    });
  }

  updateIndex = (selectedIndex) => {
    this.setState({ selectedIndex });
  }

  renderCategoryForm(categoryChoices, selectedIndex) {
    const categoryUpdated = ((selectedIndex !== this.state.selectedIndex) && (this.state.selectedIndex !== undefined));
    const indexCategory = categoryUpdated ? this.state.selectedIndex : selectedIndex;

    return (
      <ButtonGroup
        onPress={this.updateIndex}
        selectedIndex={(indexCategory >= 0) ? indexCategory : 0}
        buttons={categoryChoices}
        containerStyle={{ height: 30,
          backgroundColor: '#49beb7',
          borderTopWidth: 1,
          borderColor: 'white',
          marginTop: 40 }}
        innerBorderStyle={{ width: 7, color: '#FFFFFF' }}
        textStyle={{ color: 'white', fontSize: 14 }}
        selectedButtonStyle={{ backgroundColor: '#ff8b6a' }}
      />
    );
  }

  render() {
    i18n.locale = Localization.locale;
    i18n.fallbacks = true;

    i18n.translations = {
      fr: {
        prAdded: 'Votre demande a bien été créée.',
        prEdited: 'Votre demande a bien été modifiée.',
        missingField: 'Merci de remplir tous les champs pour modifier votre prière.',
        addTitle: 'Ajoutez le titre de votre demande.',
        bodyTitle: 'Écrivez votre demande de prière la plus détaillée possible.',
      },
      en: {
        prAdded: 'Your request has been created.',
        prEdited: 'You request has been edited.',
        missingField: 'Please fill all required fields',
        addTitle: 'Add a title to your request.',
        bodyTitle: 'Write your detailed request.',
      },
    };

    const categoryChoices = this.state.categories.slice(0, 6);
    const index = categoryChoices.indexOf(this.state.prCategory);

    return (
      <View style={styles.container} >
        <View style={styles.positionPublishButton} >
          { this.state.editPrayer ?
            <PublishButton onPress={ () => this.prayerRequestUpdate() } />
            :
            <PublishButton onPress={ () => this.addPrayerRequest() } />
          }
        </View >

        { this.state.loaded ?
          <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center' }}>
            {this.renderCategoryForm(categoryChoices, index)}
            <Divider style={styles.divider} />
            <TextInput
              placeholder={ i18n.t('addTitle', { defaultValue: 'Title' }) }
              inputStyle={{ width: '100%', color: 'black' }}
              underlineColorAndroid="transparent"
              multiline
              onChangeText={(title) => this.setState({ title })}
              style={styles.titleInput}
              value={this.state.title}
            />
            <Divider style={styles.divider} />
            <KeyboardAvoidingView
              style={{ flex: 1, flexDirection: 'column', justifyContent: 'center' }}
              behavior="padding"
              enabled keyboardVerticalOffset={120}
            >
              <ScrollView>
                <TextInput
                  placeholder={ i18n.t('bodyTitle', { defaultValue: 'Body' }) }
                  inputStyle={{ width: '100%', color: 'black' }}
                  underlineColorAndroid="transparent"
                  multiline
                  onChangeText={(body) => this.setState({ body })}
                  style={styles.input}
                  value={this.state.body}
                  selectTextOnFocus={true}
                />
              </ScrollView>
            </KeyboardAvoidingView>
          </View>
          :
          <ActivityIndicator size="large" style = {styles.loader} />
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  divider: {
    backgroundColor: '#dee0d9',
    width: '90%',
    height: 1,
    marginLeft: '5%',
    marginTop: 20,
    marginBottom: 10,
  },
  input: {
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10,
  },
  titleInput: {
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10,
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: 30,
  },
  button_text: {
    color: '#207dff',
  },
  pickerTitle: {
    marginBottom: 10,
    color: '#d3d3d3',
  },
  positionPublishButton: {
    position: 'absolute',
    right: '10%',
    top: '4%',
  },
});

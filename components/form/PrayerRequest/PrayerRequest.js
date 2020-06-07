import React, { Component } from 'react';
import { TouchableHighlight, TextInput, StyleSheet, View,
  Text, Button, TouchableOpacity, ActivityIndicator, Picker, ScrollView, KeyboardAvoidingView } from 'react-native';
import { Input, Divider, ButtonGroup } from 'react-native-elements';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { createPrayerRequestAndRedirect, retrievePrayerRequestId, editPrayerRequest } from '../../../api/PrayerRequest';
import { displayMessage } from "../../shared/message";
import { getCategories } from '../../../api/Category';
import { NavigationEvents } from 'react-navigation';
import { connect } from 'react-redux';

import PublishButton from '../../shared/buttons/PublishButton';
import { styles } from './Styles'

import * as Localization from 'expo-localization';
import i18n from 'i18n-js';

import { updatePrayerRequest, newPrayerRequest } from '../../../store/actions/actionCreators'

class PrayerRequest extends Component {
  constructor(props) {
    super(props);
    const params = props.navigation.state.params;
    this.state = {
      username: params.username,
      editPrayer: params.editPrayer,
      body: params.body,
      title: params.title,
      prCategory: params.category,
      prayerRequestId: params.prayerRequestId,
      categories: [],
      selectedIndex: undefined,
      loaded: false
    };
  }

  addPrayerRequest() {
    const firstRowCategory = this.state.categories.slice(0, 6);
    if (this.state.title && this.state.body) {
      createPrayerRequestAndRedirect({
        username: this.state.username,
        currentUserToken: this.props.currentUser,
        body: this.state.body,
        title: this.state.title,
        category: firstRowCategory[this.state.selectedIndex],
        navigation: this.props.navigation
      }).then(response => {
         return response.json()
       }).then(prayerRequest => {
         this.props.dispatch(newPrayerRequest(prayerRequest))
         this.props.navigation.navigate("Prayer", {
           newPrayer: true,
           prayerRequest: prayerRequest,
           currentUserToken: this.props.currentUser
         });
       })
      displayMessage(i18n.t('prAdded', { defaultValue: 'Demande de prière ajoutée.' }), 'success');
    } else {
      displayMessage(i18n.t('missingField', { defaultValue: 'Merci de remplir tous les champs pour ajouter votre demande.' }), 'warning');
    }
  }


  prayerRequestUpdate(prayerRequestId) {
    const colorDictionnary = {
                                Finance: '#6ce99a',
                                Autres: '#196eef',
                                Famille: '#79b8c5',
                                Couple: '#ff7567',
                                Santé: '#88d1d6',
                                Travail: '#0684d3'
                            };
    const firstRowCategory = this.state.categories.slice(0, 6);
    const category = (this.state.selectedIndex === undefined) ? this.state.prCategory : firstRowCategory[this.state.selectedIndex]
    const color = colorDictionnary[category]
    if (this.state.title && this.state.body) {
      editPrayerRequest({
        currentUserToken: this.props.currentUser,
        title: this.state.title,
        body: this.state.body,
        prayerRequestId: this.props.navigation.state.params.prayerRequestId,
        navigation: this.props.navigation,
        category: category,
      }).then(() => {
        this.props.dispatch(updatePrayerRequest(this.props.navigation.state.params.prayerRequestId, this.state.title, this.state.body, category, color));
        displayMessage(i18n.t('prEdited', { defaultValue: 'Demande de prière mise à jour !' }), 'success');
      });
    } else {
      displayMessage(i18n.t('missingField', { defaultValue: 'Merci de remplir tous les champs.' }), 'warning');
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
          { (this.state.editPrayer || this.props.navigation.state.params.editPrayer) ?
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
          </View>
          :
          <ActivityIndicator size="large" style = {styles.loader} />
        }
      </View>
    );
  }
}

const mapDispatchToProps = dispatch => ({
   dispatch
});

const mapStateToProps = (state, ownProps) => {
  return {
    currentUser: state.userReducer.data
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PrayerRequest)

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

export default class PrayerRequestForm extends Component {
  constructor(props) {
    super(props);
    const params = props.navigation.state.params
    const prCategory = params.category

    this.state = {
      username: params.username,
      currentUserEmail: params.currentUserEmail,
      editPrayer: params.editPrayer,
      body: params.body,
      title: params.title,
      prCategory: prCategory,
      prayerRequestId: params.prayerId,
      categories: [],
      selectedIndex: undefined,
      loaded: false
    };
    this.updateIndex = this.updateIndex.bind(this)
  }

  addPrayerRequest() {
    const firstRowCategory = this.state.categories.slice(0, 6);
    if (this.state.title && this.state.body) {
      createPrayerRequestAndRedirect({ username: this.state.username,
        currentUserEmail: this.state.currentUserEmail,
        body: this.state.body,
        title: this.state.title,
        category: firstRowCategory[this.state.selectedIndex],
        navigation: this.props.navigation
      });
    } else {
      displayMessage('Merci de remplir tous les champs pour ajouter votre demande de prière', 'warning')
    }
  }

  prayerRequestUpdate(prayerRequestId) {
    const firstRowCategory = this.state.categories.slice(0, 6);
    if (this.state.title && this.state.body) {
      editPrayerRequest({ currentUserEmail: this.state.currentUserEmail,
        currentUserEmail: this.state.currentUserEmail,
        title: this.state.title,
        body: this.state.body,
        prayerRequestId: this.state.prayerRequestId,
        navigation: this.props.navigation,
        category: firstRowCategory[this.state.selectedIndex]
      });
      displayMessage('Votre demande a bien été modifiée', 'success')
    } else {
      displayMessage('Merci de remplir tous les champs pour modifier votre prière', 'warning')
    }
  }

  componentDidMount() {
    this.displayCategories()
  }

  displayCategories() {
    getCategories().then(data => {
      this.setState({ categories:
         data.categories.map((response, index) => {
          return response.label
        }),
      });
    });
    this.setState({ loaded: true })
  }

  onValueChange(category) {
    this.setState({ category: category });
  }

  updateIndex (selectedIndex) {
    this.setState({selectedIndex})
  }

  renderCategoryForm(categoryChoices, selectedIndex) {
    const categoryHasBeenUpdated = ((selectedIndex != this.state.selectedIndex) && (this.state.selectedIndex != undefined))
    const indexCategory =  categoryHasBeenUpdated ?  this.state.selectedIndex : selectedIndex

    return (
      <ButtonGroup
        onPress={this.updateIndex}
        selectedIndex={(indexCategory >= 0) ? indexCategory : 0}
        buttons={categoryChoices}
        containerStyle={{ height: 30, backgroundColor: '#49beb7', borderTopWidth: 1, borderColor: 'white', marginTop: 40 }}
        innerBorderStyle={{ width: 7, color: '#FFFFFF' }}
        textStyle={{ color: 'white', fontSize: 14 }}
        selectedButtonStyle={{ backgroundColor:'#ff8b6a' }}
      />
    )
  }


  render() {
    const bodyEdition = this.state.body ? this.state.body : '';
    const titleEdition = this.state.title ? this.state.title : '';
    const categoryChoices = this.state.categories.slice(0, 6);
    const index = categoryChoices.indexOf(this.state.prCategory);

    return (
      <View style={styles.container} >
        { this.state.editPrayer ?
          <TouchableOpacity style={styles.publish_button} onPress={(value) => { this.prayerRequestUpdate(); }}>
            <Text style={styles.button_text}>Publier</Text>
          </TouchableOpacity>
          :
          <TouchableOpacity style={styles.publish_button} onPress={(value) => { this.addPrayerRequest(); }}>
            <Text style={styles.button_text}>Publier</Text>
          </TouchableOpacity>

        }
        <View style={styles.formContainer} style={{ flex: 1, flexDirection: 'column', justifyContent: 'center'}}>
          { this.state.loaded ?
            this.renderCategoryForm(categoryChoices, index)
            :
            <Text>''</Text>
          }
          <Divider style={styles.divider} />
          <TextInput
            placeholder={ 'Ajoutez le titre de votre demande.' }
            inputStyle={{ width: '100%', color: 'black' }}
            underlineColorAndroid="transparent"
            multiline
            onChangeText={(title) => this.setState({ title })}
            style={styles.title_input}
            value={titleEdition}
          />
          <Divider style={styles.divider} />
          <KeyboardAvoidingView style={{ flex: 1, flexDirection: 'column', justifyContent: 'center'}} behavior="padding" enabled   keyboardVerticalOffset={120}>
            <ScrollView>
              <TextInput
                placeholder={ "Écrivez votre demande de prière la plus détaillée possible." }
                inputStyle={{ width: '100%', color: 'black' }}
                underlineColorAndroid="transparent"
                multiline
                onChangeText={(body) => this.setState({ body })}
                style={styles.input}
                value={bodyEdition}
                selectTextOnFocus={true}
              />
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
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
    marginTop: 20,
    marginBottom: 10
  },
  input: {
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10,
  },
  title_input: {
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10,
    fontWeight: 'bold'
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
    color: '#d3d3d3'
  }
});

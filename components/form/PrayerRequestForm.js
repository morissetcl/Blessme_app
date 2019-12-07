import React, { Component } from 'react';
import { TouchableHighlight, TextInput, StyleSheet, View,
  Text, Button, TouchableOpacity, ActivityIndicator, Picker } from 'react-native';
import { Input, Divider, ButtonGroup } from 'react-native-elements';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPenSquare, faHeart, faMicrophone } from '@fortawesome/free-solid-svg-icons';
import { createPrayerRequestAndRedirect, retrievePrayerRequestId, editPrayerRequest } from '../../api/PrayerRequest';
import { displayMessage } from "../shared/message";
import { getCategories } from '../../api/Category';
import { NavigationEvents } from 'react-navigation';

export default class PrayerRequestForm extends Component {
  constructor(props) {
    super(props);
    const params = props.navigation.state.params
    const prCategory = params.prayerRequest.category ? params.prayerRequest.category.label : params.prayerRequest.category

    this.state = {
      username:params.username,
      currentUserEmail:params.currentUserEmail,
      editPrayer:params.editPrayer,
      body:params.prayerRequest.body,
      title:params.prayerRequest.title,
      prCategory: prCategory,
      prayerRequestId: params.prayerRequest.id,
      categories: [],
      selectedIndex: undefined,
      loaded: false
    };
    this.updateIndex = this.updateIndex.bind(this)
  }

  addPrayerRequest() {
    const firstRowCategory = this.state.categories.slice(0, 6);
    if (this.state.title.length !== 0 && this.state.body.length !== 0) {
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

  editPrayerRequest(prayerRequestId) {
    const firstRowCategory = this.state.categories.slice(0, 6);
    if (this.state.body.length !== 0) {
      editPrayerRequest({ currentUserEmail: this.state.currentUserEmail,
        currentUserEmail: this.state.currentUserEmail,
        title: this.state.title,
        body: this.state.body,
        prayerRequestId: this.state.prayerRequestId,
        navigation: this.props.navigation,
        category: firstRowCategory[this.selectedIndex]
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
    const categoryHasBeenUpdated = ((selectedIndex != this.state.selectedIndex) && this.state.selectedIndex)
    const indexCategory =  categoryHasBeenUpdated ?  this.state.selectedIndex : selectedIndex
    return (
      <ButtonGroup
        onPress={this.updateIndex}
        selectedIndex={indexCategory}
        buttons={categoryChoices}
        containerStyle={{ height: 30, backgroundColor: '#49beb7', borderTopWidth: 1, borderColor: 'white'}}
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
          <TouchableOpacity style={styles.publish_button} onPress={(value) => { this.editPrayerRequest(); }}>
            <Text style={styles.button_text}>Publier</Text>
          </TouchableOpacity>
          :
          <TouchableOpacity style={styles.publish_button} onPress={(value) => { this.addPrayerRequest(); }}>
            <Text style={styles.button_text}>Publier</Text>
          </TouchableOpacity>

        }
        <View style={styles.formContainer}>
          <Text style={styles.pickerTitle}>Sélectionnez une catégorie</Text>
          { this.state.loaded ?
            this.renderCategoryForm(categoryChoices, index)
            :
            <Text>''</Text>
          }
          <TextInput
            placeholder={ 'Une courte phrase résumant votre demande' }
            inputStyle={{ width: '100%', color: 'black' }}
            underlineColorAndroid="transparent"
            multiline
            onChangeText={(title) => this.setState({ title })}
            style={styles.input}
            value={titleEdition}
          />
          <Divider style={styles.divider} />
          <TextInput
            placeholder={ 'Écrivez votre demande de prière la plus détaillée possible.' }
            inputStyle={{ width: '100%', color: 'black' }}
            underlineColorAndroid="transparent"
            multiline
            onChangeText={(body) => this.setState({ body })}
            style={styles.input}
            value={bodyEdition}
          />
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
    width: '80%',
    marginLeft: '10%',
    marginTop: 20,
  },
  prayer_title: {
    textAlign: 'justify',
    paddingRight: '30%',
    paddingLeft: 10,
    paddingTop: 20,
    fontWeight: 'bold',
  },
  input: {
    marginTop: 30,
    marginLeft: 10,
    marginRight: 10,
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: 30,
  },
  button_text: {
    color: '#207dff',
  },
  formContainer: {
    marginTop: 40
  },
  pickerTitle: {
    marginBottom: 10,
    color: '#d3d3d3'
  }
});

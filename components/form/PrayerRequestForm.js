import React, { Component } from 'react';
import { TouchableHighlight, TextInput, StyleSheet, View,
  Text, Button, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Input, Divider } from 'react-native-elements';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPenSquare, faHeart, faMicrophone } from '@fortawesome/free-solid-svg-icons';
import { createPrayerRequestAndRedirect, retrievePrayerRequestId, editPrayerRequest } from '../../api/PrayerRequest';
import { displayMessage } from "../shared/message";

export default class PrayerRequestForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: props.navigation.state.params.username,
      currentUserEmail: props.navigation.state.params.currentUserEmail,
      editPrayer: props.navigation.state.params.editPrayer,
      body: props.navigation.state.params.prayerRequest.body,
      title: props.navigation.state.params.prayerRequest.title,
      prayerRequestId: props.navigation.state.params.prayerRequest.id
    };
  }

  addPrayerRequest() {
    if (this.state.title.length !== 0 && this.state.body.length !== 0) {
      createPrayerRequestAndRedirect({ username: this.state.username,
        currentUserEmail: this.state.currentUserEmail,
        body: this.state.body,
        title: this.state.title,
        navigation: this.props.navigation
      });
    } else {
      displayMessage('Merci de remplir tous les champs pour ajouter votre demande de prière', 'warning')
    }
  }

  editPrayerRequest(prayerRequestId) {
    if (this.state.body.length !== 0) {
      editPrayerRequest({ currentUserEmail: this.state.currentUserEmail,
        currentUserEmail: this.state.currentUserEmail,
        title: this.state.title,
        body: this.state.body,
        prayerRequestId: this.state.prayerRequestId,
        navigation: this.props.navigation,
      });
    } else {
      displayMessage('Merci de remplir tous les champs pour modifier votre prière', 'warning')
    }
  }

  render() {
    const bodyEdition = this.state.body ? this.state.body : '';
    const titleEdition = this.state.title ? this.state.title : '';

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
});

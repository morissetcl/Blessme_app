import React, { Component } from 'react';
import { TouchableHighlight, TextInput, StyleSheet, View,
  Text, Button, TouchableOpacity, ActivityIndicator, Picker, ScrollView, Alert } from 'react-native';
import { displayMessage } from "../shared/message";
import { updateUser } from '../../api/User';

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
    if (this.state.username) {
      updateUser({ email: this.state.email,
        username: this.state.username,
        biography: this.state.biography,
        navigation: this.props.navigation
      });
      displayMessage('Vos informations ont bien été modifié', 'success')
    } else {
      displayMessage('Merci de remplir tous les champs pour modifier vos informations', 'warning')
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
    'Vous allez être déconnecté',
      'Ëtes vous sûr ?',
      [
        {
          text: 'Annuler',
          style: 'cancel',
          onPress: () => console.log('cancel pressed')
        },
        { text: 'Oui',
          onPress: () => this.state.navigation.navigate('Homepage', { signOut: true })
        }
      ],
      {cancelable: false},
    );
  }

  render() {
    return (
      <View style={styles.container} >
        <TouchableOpacity style={styles.publish_button}
          onPress={(value) => { this.editUser(); }}>
          <Text style={styles.button_text}>Modifier</Text>
        </TouchableOpacity>
        <Text style={styles.title_input} >Username</Text>
        <TextInput
          inputStyle={{ width: '100%', color: 'black', backgroundColor: 'red' }}
          underlineColorAndroid="transparent"
          multiline
          value={this.state.username}
          onChangeText={(username) => this.setState({ username })}
          style={styles.input}
        />
        <Text style={styles.title_input} >Un petit mot sur vous</Text>
        <TextInput
          placeholder={ 'Écrivez un petit mot sur vous' }
          inputStyle={{ width: '100%', color: 'black' }}
          underlineColorAndroid="transparent"
          multiline
          value={this.state.biography}
          onChangeText={(biography) => this.setState({ biography })}
          style={styles.input}
        />
        <TouchableOpacity style={styles.signout_button}
          onPress={() => this.modalAlert()}>
          <Text style={styles.button_text}>Déconnexion</Text>
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

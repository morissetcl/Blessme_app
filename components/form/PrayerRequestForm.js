import React, { Component } from 'react';
import { TouchableHighlight, TextInput, StyleSheet, View, Text, Button, TouchableOpacity, ActivityIndicator } from 'react-native'
import { Input, Divider } from 'react-native-elements';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faPenSquare, faHeart, faMicrophone } from '@fortawesome/free-solid-svg-icons'
import { createPrayerRequestAndRedirect, retrievePrayerRequestId } from '../../api/PrayerRequest'

export default class PrayerRequestForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUserEmail: props.navigation.state.params.currentUserEmail,
      title: '',
      body: ''
    }
  }

  addPrayerRequest() {
    createPrayerRequestAndRedirect({ currentUserEmail: 'koala@yahoo.fr', body: this.state.body , title: this.state.title, navigation: this.props.navigation, fromForm: true })
  }

  render() {
    return (
      <View style={styles.container} >

      <Text style={styles.publish_button} onPress={(value) => { this.addPrayerRequest() }}>Publier</Text>
        <TextInput
          placeholder={ 'Une courte phrase résumant votre demande' }
          inputStyle={{ width: '100%', color: 'black' }}
          underlineColorAndroid="transparent"
          multiline
          onChangeText={(title) => this.setState({title})}
          style={styles.input}
        />
        <Divider style={styles.divider} />
        <TextInput
          placeholder={ 'Écrivez votre demande de prière la plus détaillée possible.' }
          inputStyle={{ width: '100%', color: 'black' }}
          underlineColorAndroid="transparent"
          multiline
          onChangeText={(body) => this.setState({body})}
          style={styles.input}
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
    borderBottomWidth: 2
  },
  divider: {
    backgroundColor: '#dee0d9',
    width: '80%',
    marginLeft: '10%',
    marginTop: 20
  },
  prayer_title: {
    textAlign: 'justify',
    paddingRight: '30%',
    paddingLeft: 10,
    paddingTop: 20,
    fontWeight: 'bold'
  },
  input: {
    marginTop: 30,
    marginLeft: 10,
    marginRight: 10
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop:30
  }
})

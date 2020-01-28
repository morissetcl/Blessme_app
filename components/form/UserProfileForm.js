import React, { Component } from 'react';
import { TouchableHighlight, TextInput, StyleSheet, View,
  Text, Button, TouchableOpacity, ActivityIndicator, Picker, ScrollView } from 'react-native';
import { Input, Divider, ButtonGroup } from 'react-native-elements';
import { displayMessage } from "../shared/message";
import { updateUser } from '../../api/User';

export default class UserProfileForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: props.navigation.state.params.username,
      avatarUrl: props.navigation.state.params.avatarUrl,
      email: props.navigation.state.params.email
    };
  }

  editUser() {
    updateUser({ email: this.state.email,
      avatar: this.state.avatarUrl,
      username: this.state.username,
      navigation: this.props.navigation
    });
  }

  render() {
    return (
      <View style={styles.container} >
        <Text style={styles.prayer_title} >{ this.state.prayerTitle }</Text>
        <TouchableOpacity style={styles.publish_button}
          onPress={(value) => { this.editUser() }}>
          <Text style={styles.button_text}>Modifier</Text>
        </TouchableOpacity>
        <Divider style={styles.divider} />

        <Text>Nom</Text>
        <TextInput
          placeholder={ 'Écrivez votre prière..' }
          inputStyle={{ width: '100%', color: 'black' }}
          underlineColorAndroid="transparent"
          multiline
          value={this.state.username}
          onChangeText={(username) => this.setState({ username })}
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

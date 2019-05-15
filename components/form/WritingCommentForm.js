import React, { Component } from 'react';
import { TouchableHighlight, TextInput, StyleSheet, View, Text, Button, TouchableOpacity, ActivityIndicator } from 'react-native'
import { Input, Divider } from 'react-native-elements';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faPenSquare, faHeart, faMicrophone } from '@fortawesome/free-solid-svg-icons'
import { createPrayer } from '../../api/Prayer'

export default class WritingCommentForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      prayerTitle: props.navigation.state.params.prayerRequest.title,
      currentUserEmail: props.navigation.state.params.currentUserEmail,
      prayerId: props.navigation.state.params.prayerId,
      body: '',
    }
  }

  addPrayer() {
    createPrayer({ currentUserEmail: this.state.currentUserEmail, body: this.state.body , prayerId: this.state.prayerId })
  }

  render() {
    return (
      <View style={styles.container} >
        <Text style={styles.prayer_title} >{ this.state.prayerTitle }</Text>
        <Text style={styles.publish_button} onPress={(value) => { this.addPrayer() }}>Publier</Text>
        <Divider style={styles.divider} />
        <TextInput
          placeholder={ 'Écrivez votre prière..' }
          inputStyle={{ width: '100%', color: 'black' }}
          underlineColorAndroid="transparent"
          multiline
          onChangeText={(body) => this.setState({body})}
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
  comment_input: {
    marginTop: 30,
    marginLeft: 10
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF' // background tab color
  }
})

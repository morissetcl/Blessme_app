import React, { Component } from 'react';
import { TouchableHighlight, TextInput, StyleSheet, View,
  Text, Button, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Input, Divider } from 'react-native-elements';
import { createPrayer, editPrayer } from '../../api/Prayer';
import { displayMessage } from "../shared/message";

export default class WritingCommentForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      prayerTitle: props.navigation.state.params.prayerRequest.title,
      currentUserEmail: props.navigation.state.params.currentUserEmail,
      prayerId: props.navigation.state.params.prayerId,
      body: props.navigation.state.params.body,
      editPrayer: props.navigation.state.params.body,
      commentId: props.navigation.state.params.commentId,
    };
  }

  addPrayer(prayerId) {
    if (this.state.body) {
      createPrayer({ currentUserEmail: this.state.currentUserEmail,
        body: this.state.body,
        prayerId: this.state.prayerId,
        navigation: this.props.navigation });
    } else {
      displayMessage('Merci de remplir tous les champs pour ajouter votre prière', 'warning')
    }
  }

  editrayer(prayerId) {
    if (this.state.body) {
      editPrayer({ currentUserEmail: this.state.currentUserEmail,
        body: this.state.body,
        prayerId: this.state.prayerId,
        navigation: this.props.navigation,
        commentId: this.state.commentId });
      displayMessage('Votre prière a bien été modifiée', 'success')
    } else {
      displayMessage('Merci de remplir tous les champs pour modifier votre prière', 'warning')
    }
  }

  render() {
    const bodyEdition = this.state.body ? this.state.body : '';
    return (
      <View style={styles.container} >
        <Text style={styles.prayer_title} >{ this.state.prayerTitle }</Text>
        { this.state.editPrayer ?
          <TouchableOpacity style={styles.publish_button}
            onPress={(value) => { this.editrayer(this.state.prayerId); }}>
            <Text style={styles.button_text}>Modifier</Text>
          </TouchableOpacity>
          :
          <TouchableOpacity style={styles.publish_button}
            onPress={(value) => { this.addPrayer(this.state.prayerId); }}>
            <Text style={styles.button_text}>Publier</Text>
          </TouchableOpacity>

        }
        <Divider style={styles.divider} />
        <TextInput
          placeholder={ 'Écrivez votre prière..' }
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

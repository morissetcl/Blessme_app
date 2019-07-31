import React, { Component } from 'react';
import { TouchableHighlight, TextInput, StyleSheet, View, Text, Button, TouchableOpacity, ActivityIndicator, Dimensions } from 'react-native'
import { Item, Form, Input, Label } from "native-base";
import { showMessage } from "react-native-flash-message";

export default class ResetPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: ''
    }
  }

  resetPassword(email) {
    var emailAddress = "clement.morisset@yahoo.fr";
    this.props.navigation.state.params.firebase.sendPasswordResetEmail(email).then(function() {
      showMessage({
        message: "Un email vous a été envoyé pour réinitialiser votre mot de passe.",
        type: 'success',
        icon: 'success'
      });
    }).catch(function(error) {
      switch(error.code) {
        case 'auth/invalid-email':
              showMessage({
                message: "Aucun utilisateur trouvé, veuillez vérifier votre email.",
                type: 'warning',
                icon: 'warning'
              });
     }
   })
  }

  render() {
    return (
      <View style={styles.form_wrapper}>
        <Form>
          <Item floatingLabel>
            <Label>Email</Label>
            <Input
              autoCapitalize="none"
              autoCorrect={false}
              onChangeText={email => this.setState({ email: email })}
            />
          </Item>
        </Form>
        <View style={styles.boutons_wrapper}>
          <TouchableOpacity style={styles.bouton} onPress={() => this.resetPassword(this.state.email)} >
            <Text style={{color: 'white'}}>Réinitialiser</Text>
          </TouchableOpacity>
       </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  inscription_buttons: {
    position: 'absolute',
    bottom: 10,
    marginLeft: 'auto',
    marginRight: 'auto',
    left: 0,
    right: 0
  },
  image: {
    flex: 1,
    position: 'absolute',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height + 35
  },
  boutons_wrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginLeft: '5%',
    marginTop: 15
  },
  form_wrapper: {
    backgroundColor: 'white',
    paddingLeft: '5%',
    paddingRight: '10%',
    paddingBottom: '5%',
    margin: '12%',
    borderRadius: 10
  },
  connexion_from: {
    paddingTop: Dimensions.get('window').height / 10,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  container: {
    height: Dimensions.get('window').height + 35,
    backgroundColor: '#FFFFFF' // background tab color
  },
  loader: {
    color:"#0000ff",
    flex: 1,
    alignItems: 'center',
    position: 'absolute',
    top: 200,
    left: 150
  },
  bouton_transparent: {
    borderColor: '#01676b',
    backgroundColor: 'transparent',
    padding: 15,
    display: 'flex',
    alignItems: 'center',
    width: Dimensions.get('window').width - '20%',
    marginBottom: '2%',
    borderRadius: 30,
    borderWidth: 2

  },
  bouton: {
    borderColor: 'transparent',
    backgroundColor: '#ff8b6a',
    padding: 10,
    display: 'flex',
    alignItems: 'center',
    width: '80%',
    marginBottom: '5%',
    borderRadius: 30,
    borderWidth: 2
  },
  connexion_input: {
    marginBottom: '10%'
  },
  loader: {
    color:"#0000ff",
    flex: 1,
    alignItems: 'center',
    position: 'absolute',
    top: '50%',
    left: '50%'
  },
  bouton_fb: {
    marginTop: '5%',
    borderColor: 'transparent',
    backgroundColor: '#ff8b6a',
    padding: 10,
    display: 'flex',
    alignItems: 'center',
    width: '80%',
    borderRadius: 30,
    borderWidth: 2,
    backgroundColor: '#3B5998'
  },
  facebookButtonText: {
    color: '#fff'
  },
  space: {
    height: 17
  }
});
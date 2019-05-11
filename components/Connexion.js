import React from 'react';
import { StyleSheet, Text, View, Alert, TouchableOpacity } from 'react-native';
import { Container, Item, Form, Input, Button, Label } from "native-base";
import * as firebase from "firebase";
import Prayers from './Prayers'

export default class Connexion extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      logged: false
    };
  }

  SignUp = (email, password) => {
    try {
    firebase.auth().createUserWithEmailAndPassword(email,password)
      .then(() => this.setState({ logged: true }))
      .catch(error => {
        switch(error.code) {
          case 'auth/email-already-in-use':
                Alert.alert('Email already in use !')
                break;
       }
     })
   } catch (error){
       alert("Error : ", error);
   }
  };

  Login = (email, password) => {
    try {
      firebase
       .auth()
       .signInWithEmailAndPassword(email, password)
       .then(() => this.setState({ logged: true }))
       .catch(error => {
         switch(error.code) {
           case 'auth/user-not-found':
                 Alert.alert('User not found !')
                 break;
        }
      })
    } catch (error) {
        alert("Error : ", error);
    }
  };

  componentWillMount(){
    var firebaseConfig = {
      apiKey: process.env.FIREBASE_API_KEY,
      authDomain: process.env.FIREBASE_AUTH_DOMAIN,
      databaseURL: process.env.FIREBASE_DB_URL,
      projectId: process.env.FIREBASE_PROJECT_ID,
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.FIREBASE_MESSAGE_SENDER_ID,
      appId: process.env.FIREBASE_MESSAGE_APP_ID
    };
    firebase.initializeApp(firebaseConfig);
  }

  render() {
    return (
      <View>
      {this.state.logged ?
        <Prayers/>
        :
        <View>
          <Form>
            <Item floatingLabel>
              <Label>Email</Label>
              <Input
                autoCapitalize="none"
                autoCorrect={false}
                onChangeText={email => this.setState({ email })}
              />
            </Item>
            <Item floatingLabel style={styles.connexion_input}>
              <Label>Mot de passe</Label>
              <Input
                secureTextEntry={true}
                autoCapitalize="none"
                autoCorrect={false}
                onChangeText={password => this.setState({ password })}
              />
            </Item>
            <TouchableOpacity style={styles.bouton} onPress={() => this.SignUp(this.state.email, this.state.password)} >
              <Text>Inscription</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.bouton_transparent} onPress={() => this.Login(this.state.email, this.state.password)}>
              <Text>Déja inscrit ?</Text>
            </TouchableOpacity>
          </Form>
        </View>
      }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  coucou: {
    width: '80%',
  },
  bouton_transparent: {
    borderColor: '#01676b',
    backgroundColor: 'transparent',
    padding: 15,
    display: 'flex',
    alignItems: 'center',
    width: '80%',
    marginLeft: '10%',
    marginBottom: '2%',
    borderRadius: 30,
    borderWidth: 2,
    color: 'red'
  },
  bouton: {
    borderColor: 'transparent',
    backgroundColor: '#01676b',
    padding: 15,
    display: 'flex',
    alignItems: 'center',
    width: '80%',
    marginLeft: '10%',
    marginBottom: '2%',
    borderRadius: 30,
    borderWidth: 2
  },
  connexion_input: {
    marginBottom: '10%'
  }
});

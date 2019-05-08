import React from 'react';
import { StyleSheet, Text, View, Alert } from 'react-native';
import { Container, Item, Form, Input, Button, Label } from "native-base";
import * as firebase from "firebase";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: ""
    };
  }

  SignUp = (email, password) => {
    try {
    firebase.auth().createUserWithEmailAndPassword(email,password)
      .then(() => this.props.navigation.navigate('home'))
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
       .then(() => this.props.navigation.navigate('home'))
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
      <Container>
        <Form>
          <Item floatingLabel>
            <Label>Email</Label>
            <Input
              autoCapitalize="none"
              autoCorrect={false}
              onChangeText={email => this.setState({ email })}
            />
          </Item>
          <Item floatingLabel>
            <Label>Password</Label>
            <Input
              secureTextEntry={true}
              autoCapitalize="none"
              autoCorrect={false}
              onChangeText={password => this.setState({ password })}
            />
          </Item>
          <Button full rounded success onPress={() => this.Login(this.state.email, this.state.password)}>
            <Text>Login</Text>
          </Button>
          <Button full rounded success style={{ marginTop: 20 }} onPress={() => this.SignUp(this.state.email, this.state.password)} >
            <Text>Signup</Text>
          </Button>
        </Form>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

import React from 'react';
import { StyleSheet, Text, View, Alert, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Item, Form, Input, Label } from "native-base";
import * as firebase from "firebase";
import Prayers from './Prayers'

export default class Connexion extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      username: "",
      logged: false,
      firebaseCheck: false
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

  componentDidMount(){
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
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          this.setState({ logged: true })
        }
        this.setState({ firebaseCheck: true })
      }
    )
  }

  render() {
    return (
      <View>
        { this.state.firebaseCheck ?
          <View style={styles.container}>
          { this.state.logged ?
            <Prayers navigation={ this.props.navigation } currentUserEmail={ firebase.auth().currentUser.email } username={this.state.username}/>
            :
            <View>
              <Form>
                <Item floatingLabel>
                  <Label>Username</Label>
                  <Input
                    autoCapitalize="none"
                    autoCorrect={false}
                    onChangeText={username => this.setState({username: username })}
                  />
                </Item>
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
          :
          <ActivityIndicator size="large" style = {styles.loader} />
        }
        </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    backgroundColor: '#FFFFFF' // background tab color
  },
  coucou: {
    width: '80%',
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
  },
  loader: {
    color:"#0000ff",
    flex: 1,
    alignItems: 'center',
    position: 'absolute',
    top: '50%',
    left: '50%'
  }
});

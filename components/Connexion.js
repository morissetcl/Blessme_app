import React from 'react';
import { StyleSheet, Text, View, Alert, TouchableOpacity, ActivityIndicator, ImageBackground, Dimensions } from 'react-native';
import { Item, Form, Input, Label } from "native-base";
import { Facebook } from 'expo';
import * as firebase from "firebase";
import Prayers from './Prayers'
import { showMessage } from "react-native-flash-message";
const FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID;
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_DB_URL,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGE_SENDER_ID,
  appId: process.env.FIREBASE_MESSAGE_APP_ID
};
firebase.initializeApp(firebaseConfig);
export const auth = firebase.auth();

export default class Connexion extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      username: "",
      logged: false,
      firebaseCheck: false,
      errorMessage: '',
      signIn: false
    };
  }

  SignUp = (email, password) => {
    if (this.state.email.length !== 0 && this.state.password.length !== 0 &&  this.state.username.length !== 0) {
      try {
      firebase.auth().createUserWithEmailAndPassword(email,password)
        .then(() => this.setState({ logged: true }))
        .catch(error => {
          switch(error.code) {
            case 'auth/invalid-email':
                  this.messageErrors('Le format de votre email est invalide')
                  break;
            case 'auth/weak-password':
                  this.messageErrors('Votre de mot de passe est trop court (minimum 6 caractères)')
                  break;
            case 'auth/email-already-in-use':
                  this.messageErrors("L'Email existe déja")
                  break;
         }
       })
     } catch (error){
         alert("Error : ", error);
     }
    } else {
      this.messageErrors('Merci de remplir tous les champs pour vous inscrire.')
    }
  };

  messageErrors(message) {
    showMessage({
      message: message,
      type: 'warning',
      icon: 'warning'
    });
  }

  Login = (email, password) => {
    try {
      firebase
       .auth()
       .signInWithEmailAndPassword(email, password)
       .then(() => this.setState({ logged: true }))
       .catch(error => {
         switch(error.code) {
           case 'auth/wrong-password':
                 this.messageErrors("Veuillez rentrer votre mot de passe")
                 break;
           case 'auth/user-not-found':
                 this.messageErrors("Aucun utilisateur trouvé, veuillez vérifier votre email et votre mot de passe")
                 break;
           case 'auth/invalid-email':
                 this.messageErrors('Le format de votre email est invalide')
                 break;
        }
      })
    } catch (error) {
        alert("Error : ", error);
    }
  };

  componentDidMount(){


    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          this.setState({ logged: true })
        }
        this.setState({ firebaseCheck: true })
      }
    )
  }

  async handleFacebookButton() {
    const { type, token } = await Facebook.logInWithReadPermissionsAsync(FACEBOOK_APP_ID, {
      permissions: ['public_profile', 'email']
    });
    if (type === 'success') {
      const credential = firebase.auth.FacebookAuthProvider.credential(token);
      auth.signInAndRetrieveDataWithCredential(credential).catch(error => {
        this.setState({ errorMessage: error.message });
      });
    }
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
              { this.state.signIn ?
                <ImageBackground source = {require('../assets/signup.jpg')} style = {styles.image} />
                :
                <ImageBackground source = {require('../assets/signin.jpg')} style = {styles.image} />
              }
              <View style={styles.connexion_from}>
                <Text style={{color: 'white', fontSize: 30, textAlign: 'center', margin: Dimensions.get('window').height / 100}}>Bless Me.</Text>
                <Text style={{color: 'white', fontSize: 18, textAlign: 'center', margin: Dimensions.get('window').height / 100}}>
                  Connectez-vous et commencez à prier pour ceux qui en on besoin.
                </Text>
              </View>
              <View style={styles.form_wrapper}>
                <Form>
                  { !this.state.signIn ?
                    <Item floatingLabel>
                      <Label>Pseudonyme</Label>
                      <Input
                        autoCapitalize="none"
                        autoCorrect={false}
                        onChangeText={username => this.setState({username: username })}
                      />
                    </Item>
                    :
                    <Text></Text>
                  }

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
                  { !this.state.signIn ?
                    <View style={styles.boutons_wrapper}>
                      <TouchableOpacity style={styles.bouton} onPress={() => this.SignUp(this.state.email, this.state.password)} >
                        <Text style={{color: 'white'}}>Inscription</Text>
                      </TouchableOpacity>
                    <Text>Ou connectez-vous via </Text>
                    <TouchableOpacity
                      style={styles.bouton_fb}
                      name="Facebook"
                      onPress={() => this.handleFacebookButton()}
                    >
                      <Text style={styles.facebookButtonText}>
                        Facebook
                      </Text>
                    </TouchableOpacity>
                  </View>
                  :
                  <View style={styles.boutons_wrapper}>
                    <TouchableOpacity style={styles.bouton} onPress={() => this.Login(this.state.email, this.state.password)} >
                      <Text style={{color: 'white'}}>Connexion</Text>
                    </TouchableOpacity>
                  </View>
                }
              </Form>
            </View>
          </View>
          }
            <View style={styles.inscription_buttons}>
              { !this.state.signIn ?
                <TouchableOpacity onPress={() => this.setState({signIn: true})} >
                  <Text style={{color: 'black', textAlign: 'center'}}>Déja inscrit ?</Text>
                </TouchableOpacity>
              :
                <TouchableOpacity onPress={() => this.setState({signIn: false})} >
                  <Text style={{color: 'white', textAlign: 'center'}}>Pas encore inscrit ?</Text>
                </TouchableOpacity>
              }
            </View>
          </View>
          :
          <ActivityIndicator size="large" style = {styles.loader} />
        }
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

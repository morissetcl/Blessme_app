import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity,
  ActivityIndicator, ImageBackground, Dimensions, KeyboardAvoidingView, Keyboard } from 'react-native';
import { Item, Form, Input, Label } from "native-base";
import HideWithKeyboard from 'react-native-hide-with-keyboard';
import * as Facebook from 'expo-facebook';
import * as firebase from "firebase";
import Prayers from './Prayers';
import { displayMessage } from "./shared/message";
import registerForNotifications from '../services/notifications';
import { createUser } from '../api/User';
const FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID;
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_DB_URL,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGE_SENDER_ID,
  appId: process.env.FIREBASE_MESSAGE_APP_ID,
};
firebase.initializeApp(firebaseConfig);
export const auth = firebase.auth();
import * as Localization from 'expo-localization';
import i18n from 'i18n-js';

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
      token: "",
      signIn: false,
      hideTagLine: false,
      signOut: false,
      alreadySignUp: false,
    };
  }

  SignUp = (email, password) => {
    { i18n.t('verse', { defaultValue: '1 Timothy 2:1' }); }
    if (this.state.email.length !== 0 && this.state.password.length !== 0 && this.state.username.length !== 0) {
      try {
        firebase.auth().createUserWithEmailAndPassword(email, password)
          .then((e) => this.initializeUser(e))
          .catch(error => {
            switch (error.code) {
              case 'auth/invalid-email':
                displayMessage(i18n.t('invalidEmail', { defaultValue: 'Add password' }), 'warning');
                break;
              case 'auth/weak-password':
                displayMessage(i18n.t('weakPassword', { defaultValue: 'Password too short' }), 'warning');
                break;
              case 'auth/email-already-in-use':
                displayMessage(i18n.t('emailExist', { defaultValue: 'Password too short' }), 'warning');
                break;
            }
          });
      } catch (error) {
        alert("Error : ", error);
      }
    } else {
      displayMessage(i18n.t('missingField', { defaultValue: 'Add password' }), 'warning');
    }
  };

  initializeUser(e) {
    createUser({ email: this.state.email, username: this.state.username, token: e['user']['uid'] });
    registerForNotifications(e['user']['uid']);

    this.setState({ logged: true, token: e['user']['uid'] });
  }

  initializeFbUser(response) {
    createUser({ email: response.user.email, token: response.user.uid });
    registerForNotifications(response.user.uid);

    this.setState({ logged: true, token: response.user.uid });
  }

  Login = (email, password) => {
    try {
      firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then((e) => this.setState({ logged: true, token: e['user']['uid'], email: email }))
        .catch(error => {
          switch (error.code) {
            case 'auth/wrong-password':
              displayMessage(i18n.t('weakPassword', { defaultValue: 'Password too short' }), 'warning');
              break;
            case 'auth/user-not-found':
              displayMessage(i18n.t('userNotFound', { defaultValue: 'User not found' }), 'warning');
              break;
            case 'auth/invalid-email':
              displayMessage(i18n.t('invalidEmail', { defaultValue: 'Add password' }), 'warning');
              break;
          }
        });
    } catch (error) {
      alert("Error : ", error);
    }
  };

  componentDidUpdate() {
    const signOut = this.props.navigation.state.params ? this.props.navigation.state.params.signOut : false;
    if (signOut && !this.state.alreadySignUp) {
      firebase.auth().signOut();
      this.setState({ logged: false, alreadySignUp: true });
    }
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({ logged: true, token: user.uid });
      }
      this.setState({ firebaseCheck: true });
    });

    this.keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      this._keyboardDidShow,
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      this._keyboardDidHide,
    );
  }

  _keyboardDidShow = () => {
    this.setState({ hideTagLine: true });
  }

  _keyboardDidHide = () => {
    this.setState({ hideTagLine: false });
  }

  async handleFacebookButton() {
    try {
      await Facebook.initializeAsync(FACEBOOK_APP_ID);
      const {
        type,
        token,
        expires,
        permissions,
        declinedPermissions,
      } = await Facebook.logInWithReadPermissionsAsync({
        permissions: ['public_profile'],
      });
      if (type === 'success') {
        const credential = firebase.auth.FacebookAuthProvider.credential(token);
        auth.signInWithCredential(credential)
          .then((response) => {
            this.initializeFbUser(response);
          })
          .catch(error => {
            this.setState({ errorMessage: error.message });
          });
      }
    } catch ({ message }) {
      alert(`Facebook Login Error: ${message}`);
    }
  }

  goToResetPassword() {
    this.props.navigation.navigate('ResetPassword', { firebase: firebase.auth() });
  }

  render() {
    i18n.locale = Localization.locale;
    i18n.fallbacks = true;

    i18n.translations = {
      fr: {
        tagLine: 'Votre foi est précieuse, partagez-la.',
        pseudonyme: 'Pseudonyme',
        email: 'Email',
        password: 'Mot de passe',
        signUp: 'Inscription',
        signIn: 'Connexion',
        fbChoice: 'Ou connectez-vous via',
        alreadySignUp: 'Déja membre ?',
        notSignUpYet: 'Pas encore inscrit ?',
        forgotPassword: 'Mot de passe oublié ?',
        verse: '1 Timothée 2:1',
        invalidEmail: 'Veuillez rentrer un email validee.',
        weakPassword: 'Votre de mot de passe est trop court (minimum 6 caractères)',
        emailExist: "L'Email existe déja",
        missingField: "Merci de remplir tout les champs.",
        userNotFound: "Aucun utilisateur trouvé, veuillez vérifier votre email et votre mot de passe.",
      },
      en: {
        tagLine: 'Your faith is worthy. Share it',
        pseudonyme: 'Username',
        email: 'Email',
        password: 'Password',
        signUp: 'Sign up',
        signIn: 'Sign in',
        fbChoice: 'Or continue with',
        alreadySignUp: 'Already a member ?',
        notSignUpYet: 'Not sign up yet ?',
        forgotPassword: 'Forgot your password ?',
        verse: '1 Timothy 2:1',
        invalidEmail: 'Please enter a valid email.',
        weakPassword: 'Your password is too short (minimum 6 characters)',
        emailExist: "Email already exist.",
        missingField: "Please fill all fields.",
        userNotFound: "User not found, please check email and password.",
      },
    };
    const email = firebase.auth().currentUser ? firebase.auth().currentUser.email : '';
    return (
      <View style={styles.container}>
        { this.state.firebaseCheck ?
          <View style={styles.container}>
            { this.state.logged ?
              <Prayers navigation={ this.props.navigation }
                currentUserToken={ this.state.token }
                email={ email }
                username={this.state.username}/>
              :
              <View style={styles.container} >
                <ImageBackground source = {require('../assets/test_Fotor.jpg')} style = {styles.image} />
                { !this.state.hideTagLine ?
                  <View style={styles.connexion_from}>
                    <Text style={{ color: 'white', fontSize: Dimensions.get('window').height / 25 , textAlign: 'center',
                      margin: Dimensions.get('window').height / 100 }}>Bless Me.</Text>
                    <Text style={{ color: 'white', fontSize: Dimensions.get('window').height / 50 , textAlign: 'center',
                      margin: Dimensions.get('window').height / 100 }}>
                      {i18n.t('tagLine', { defaultValue: 'Your faith is worthy.' })}
                    </Text>
                    <Text style={{ color: 'white', fontSize: 10, textAlign: 'center', position: 'relative', top: 10 }}>
                      {i18n.t('verse', { defaultValue: '1 Timothy 2:1' })}
                    </Text>
                  </View>
                  :
                  null
                }

                <View style={styles.form_wrapper}>
                  <Form>
                    { !this.state.signIn ?
                      <Item floatingLabel >
                        <Label style={{ fontSize: 16 }}>{i18n.t('pseudonyme', { defaultValue: 'Username' })}</Label>
                        <Input
                          autoCapitalize="none"
                          autoCorrect={false}
                          onChangeText={ username => this.setState({ username: username })}
                        />
                      </Item>
                      :
                      null
                    }

                    <Item floatingLabel >
                      <Label style={{ fontSize: 16 }}>{i18n.t('email', { defaultValue: 'Email' })}</Label>
                      <Input
                        autoCapitalize="none"
                        autoCorrect={false}
                        onChangeText={email => this.setState({ email })}
                      />
                    </Item>
                    <Item floatingLabel>
                      <Label style={{ fontSize: 15 }}>{i18n.t('password', { defaultValue: 'Mot de passe' })}</Label>
                      <Input
                        secureTextEntry={true}
                        autoCapitalize="none"
                        autoCorrect={false}
                        onChangeText={password => this.setState({ password })}
                      />
                    </Item>
                    { !this.state.signIn ?
                      <View style={styles.boutons_wrapper}>
                        <TouchableOpacity style={styles.bouton}
                          onPress={ () => this.SignUp(this.state.email, this.state.password) } >
                          <Text style={{ color: 'white' }}>{ i18n.t('signUp') }</Text>
                        </TouchableOpacity>
                        <HideWithKeyboard style={styles.divbouton_fb}>
                          <Text>{i18n.t('fbChoice', { defaultValue: 'Connect with Facebook' })}</Text>
                          <TouchableOpacity
                            style={styles.bouton_fb}
                            name="Facebook"
                            onPress={() => this.handleFacebookButton()}
                          >
                            <Text style={styles.facebookButtonText}>
                              Facebook
                            </Text>
                          </TouchableOpacity>
                        </HideWithKeyboard>
                      </View>
                      :
                      <View style={styles.boutons_wrapper}>
                        <TouchableOpacity style={styles.bouton}
                          onPress={ () => this.Login(this.state.email, this.state.password) }>
                          <Text style={{ color: 'white' }}>{i18n.t('signIn', { defaultValue: 'Sign in' })}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={ () => this.goToResetPassword() } >
                          <Text style={{
                            color: 'black',
                            textAlign: 'center' }}>
                            { i18n.t('forgotPassword', { defaultValue: 'Forgot password ?' })}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    }
                  </Form>
                </View>
              </View>
            }
            <View style={styles.inscription_buttons}>
              { !this.state.signIn ?
                <TouchableOpacity onPress={ () => this.setState({ signIn: true }) } >
                  <Text style={{
                    color: 'white',
                    textAlign: 'center' }}
                  >
                    {i18n.t('alreadySignUp', { defaultValue: 'Already sign up ?' })}
                  </Text>
                </TouchableOpacity>
                :
                <TouchableOpacity onPress={ () => this.setState({ signIn: false }) } >
                  <Text style={{
                    color: 'white',
                    textAlign: 'center',
                  }}>
                    {i18n.t('notSignUpYet', { defaultValue: 'Not sign up yet ?' })}
                  </Text>
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
  container: {
    backgroundColor: '#FFFFFF',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inscription_buttons: {
    position: 'absolute',
    top:  Dimensions.get('window').height - (Dimensions.get('window').height / 35),
    marginLeft: 'auto',
    marginRight: 'auto',
    left: 0,
    right: 0,
  },
  image: {
    position: 'absolute',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height + 100,
    resizeMode: 'cover',
  },
  boutons_wrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginLeft: '5%',
    marginTop: 15,
  },
  form_wrapper: {
    marginTop: '10%',
    backgroundColor: 'rgba(255,255,255, 0.8)',
    paddingLeft: '5%',
    paddingRight: '10%',
    paddingBottom: '5%',
    margin: '12%',
    borderRadius: 10,
    width: Dimensions.get('window').width - 60,
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
    borderWidth: 2,
  },
  connexion_from: {
    marginTop: Dimensions.get('window').height / 8
  },
  bouton: {
    borderColor: 'transparent',
    backgroundColor: '#ff8b6a',
    width: '80%',
    padding: 10,
    display: 'flex',
    alignItems: 'center',
    marginBottom: '5%',
    borderRadius: 30,
    borderWidth: 2,
  },
  loader: {
    color: "#0000ff",
    flex: 1,
    alignItems: 'center',
    position: 'absolute',
    top: '50%',
    left: '50%',
  },
  divbouton_fb: {
    width: '100%',
    display: 'flex',
    alignItems: 'center'
  },
  bouton_fb: {
    marginTop: '5%',
    borderColor: 'transparent',
    padding: 10,
    display: 'flex',
    alignItems: 'center',
    width: '80%',
    borderRadius: 30,
    borderWidth: 2,
    backgroundColor: '#3B5998',
  },
  facebookButtonText: {
    color: '#fff',
  },
  space: {
    height: 17,
  },
});

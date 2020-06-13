import React from 'react';
import { StyleSheet,
         Text,
         View,
         TouchableOpacity,
         Dimensions,
         Keyboard
       } from 'react-native';
import { Item, Form, Input, Label } from "native-base";
import * as Facebook from 'expo-facebook';
import HideWithKeyboard from 'react-native-hide-with-keyboard';
import { displayMessage } from "./shared/message";
import { createUser } from '../api/User';
import { setCurrentUser } from '../store/actions/actionCreators'
import { connect } from 'react-redux';
import registerForNotifications from '../services/notifications';
const FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID;

class SignUp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      username: '',
      token: '',
      logged: props.logged
    };
  }

  initializeUser(e) {
    createUser({
      email: this.state.email,
      username: this.state.username,
      token: e['user']['uid']
    }).then(() => {
      this.props.dispatch(setCurrentUser(e['user']['uid']))
    });
    registerForNotifications(e['user']['uid']);

    this.setState({ logged: true, token: e['user']['uid'] });
  }

  SignUp = (email, password) => {
    if (this.state.email.length !== 0 && this.state.password.length !== 0 && this.state.username.length !== 0) {
      try {
        this.props.firebase.auth().createUserWithEmailAndPassword(email, password)
          .then((e) => this.initializeUser(e))
          .catch(error => {
            switch (error.code) {
              case 'auth/invalid-email':
                displayMessage('Veuillez rentrer un email valide.', 'warning');
                break;
              case 'auth/weak-password':
                displayMessage('Votre de mot de passe est trop court (minimum 6 caractères)', 'warning');
                break;
              case 'auth/email-already-in-use':
                displayMessage("L'Email existe déja", 'warning');
                break;
            }
          });
      } catch (error) {
        alert("Erreur : ", error);
      }
    } else {
      displayMessage("Merci de remplir tout les champs.", 'warning');
    }
  };

  initializeFbUser(response) {
    createUser({
      email: response.user.email,
      token: response.user.uid
    }).then(() => {
      this.props.dispatch(setCurrentUser(response.user.uid))
    });
    registerForNotifications(response.user.uid);

    this.setState({ logged: true, token: response.user.uid });
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

  render() {
    return (
      <View style={styles.form_wrapper}>
        <Item floatingLabel style={{ marginTop: 14 }} >
          <Label style={{ fontSize: 14 }}>Pseudonyme</Label>
          <Input
            autoCapitalize="none"
            autoCorrect={false}
            onChangeText={ username => this.setState({ username: username })}
          />
        </Item>
        <Item floatingLabel style={{ marginTop: 14 }} >
          <Label style={{ fontSize: 14 }}>Email</Label>
          <Input
            autoCapitalize="none"
            autoCorrect={false}
            onChangeText={email => this.setState({ email })}
          />
        </Item>
        <Item floatingLabel style={{ marginTop: 14 }} >
          <Label style={{ fontSize: 14 }}>Mot de passe</Label>
          <Input
            secureTextEntry={true}
            autoCapitalize="none"
            autoCorrect={false}
            onChangeText={password => this.setState({ password })}
          />
        </Item>
        <View style={styles.boutons_wrapper}>
          <TouchableOpacity style={styles.bouton}
            onPress={ () => this.SignUp(this.state.email, this.state.password) } >
            <Text style={{ color: 'white' }}>Inscription</Text>
          </TouchableOpacity>
          <HideWithKeyboard style={styles.divbouton_fb}>
            <Text>Ou connectez vous via</Text>
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
      </View>
    );
  }
}



const styles = StyleSheet.create({
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
    paddingTop: '2%',
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
  }
});

const mapDispatchToProps = dispatch => ({
   dispatch
});

export default connect(null, mapDispatchToProps)(SignUp)

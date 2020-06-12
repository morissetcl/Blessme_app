import React from 'react';
import { StyleSheet,
         Text,
         View,
         TouchableOpacity,
         Dimensions
       } from 'react-native';
import { Item, Form, Input, Label } from "native-base";
import HideWithKeyboard from 'react-native-hide-with-keyboard';
import Connexion from './Connexion';
import { displayMessage } from "./shared/message";

export default class SignIn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      logged: props.logged,
      email: '',
      password: '',
      token: ''
    };
  }

  goToResetPassword() {
    this.props.navigation.navigate('ResetPassword', { firebase: this.props.firebase.auth() });
  }

  Login = (email, password) => {
    console.log(email)
    try {
      this.props.firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then((e) => this.setState({ logged: true, token: e['user']['uid'], email: email }))
        .catch(error => {
          switch (error.code) {
            case 'auth/wrong-password':
              displayMessage('Mot de passe incorrect', 'warning');
              break;
            case 'auth/user-not-found':
              displayMessage("Aucun utilisateur trouvé, veuillez vérifier votre email et votre mot de passe.", 'warning');
              break;
            case 'auth/invalid-email':
              displayMessage('Veuillez rentrer un email valide.', 'warning');
              break;
          }
        });
    } catch (error) {
      alert("Erreur : ", error);
    }
  };

  render() {
    return (
      <View style={styles.form_wrapper}>
        <Item floatingLabel >
          <Label style={{ fontSize: 16 }}>Email</Label>
          <Input
            autoCapitalize="none"
            autoCorrect={false}
            onChangeText={email => this.setState({ email })}
          />
        </Item>
        <Item floatingLabel>
          <Label style={{ fontSize: 15 }}>Mot de passe</Label>
          <Input
            secureTextEntry={true}
            autoCapitalize="none"
            autoCorrect={false}
            onChangeText={password => this.setState({ password })}
          />
        </Item>
        <View style={styles.boutons_wrapper}>
          <TouchableOpacity style={styles.bouton}
            onPress={ () => this.Login(this.state.email, this.state.password) }>
            <Text style={{ color: 'white' }}>Connexion</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={ () => this.goToResetPassword() } >
            <Text style={{
              color: 'black',
              textAlign: 'center' }}>
              Mot de passe oublié ?
            </Text>
          </TouchableOpacity>
        </View>
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
    top:  Dimensions.get('window').height - 30,
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

import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity,
  ActivityIndicator, ImageBackground, Dimensions, KeyboardAvoidingView, Keyboard } from 'react-native';
import { Item, Form, Input, Label } from "native-base";
import HideWithKeyboard from 'react-native-hide-with-keyboard';
import * as firebase from "firebase";
import Prayers from './Prayers';
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
import * as Localization from 'expo-localization';
import i18n from 'i18n-js';
import { setCurrentUser } from '../store/actions/actionCreators'
import { connect } from 'react-redux';
import SignUp from './SignUp';
import SignIn from './SignIn';

class Connexion extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      username: "",
      logged: false,
      firebaseCheck: false,
      token: "",
      signIn: false,
      hideTagLine: false,
      alreadySignUp: false,
    };
  }

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
        this.setState({ logged: true, token: user?.uid });
        this.props.dispatch(setCurrentUser(user?.uid))
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


  changeForm(value, text) {
    return <TouchableOpacity onPress={ () => this.setState({ signIn: value }) } >
             <Text style={{
               color: 'white',
               textAlign: 'center',
             }}>
              { text }
             </Text>
           </TouchableOpacity>
  }

  render() {
    const email = firebase.auth().currentUser ? firebase.auth().currentUser.email : '';
    return (
      <View style={styles.container}>
        { this.state.firebaseCheck ?
          <View style={styles.container}>
            { this.state.logged && this.props.currentUser ?
              <Prayers
                navigation={ this.props.navigation }
                currentUserToken={ this.state.token }
                email={ email }
                username={this.state.username}/>
              :
              <View style={styles.container} >
                <ImageBackground source = {require('../assets/test_Fotor.jpg')} style = {styles.image} />
                { !this.state.hideTagLine ?
                  <View style={styles.connexion_from}>
                    <Text style={styles.title}>Bless Me.</Text>
                    <Text style={styles.tagLine}>
                      Votre foi est précieuse, partagez-la.
                    </Text>
                    <Text style={{ color: 'white', fontSize: 10, textAlign: 'center', position: 'relative', top: 10 }}>
                      1 Timothy 2:1
                    </Text>
                  </View>
                  :
                  null
                }
                { !this.state.signIn ?
                  <View>
                    <SignUp
                      firebase={firebase}
                      logged={false}
                    />
                    { this.changeForm(true, 'Déja membre ?') }
                  </View>
                  :
                  <View>
                  <SignIn
                    firebase={firebase}
                    logged={false}
                    navigation={ this.props.navigation }
                  />
                    { this.changeForm(false, 'Pas encore inscrit ?') }
                  </View>
                }
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
    backgroundColor: '#FFFFFF',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    position: 'absolute',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height + 100,
    resizeMode: 'cover',
  },
  connexion_from: {
    marginTop: Dimensions.get('window').height / 8
  },
  loader: {
    color: "#0000ff",
    flex: 1,
    alignItems: 'center',
    position: 'absolute',
    top: '50%',
    left: '50%',
  },
  title: {
    color: 'white',
    textAlign: 'center',
    fontSize: Dimensions.get('window').height / 25,
    margin: Dimensions.get('window').height / 100
  },
  tagLine: {
    color: 'white',
    textAlign: 'center',
    fontSize: Dimensions.get('window').height / 50,
    margin: Dimensions.get('window').height / 100
  }
});

const mapDispatchToProps = dispatch => ({
   dispatch
});


function mapStateToProps(state) {
  return {
    currentUser: state.userReducer.data
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Connexion)

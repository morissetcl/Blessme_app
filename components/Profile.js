import React, { Component } from 'react';
import { StyleSheet, View, Text, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { Header, Avatar } from 'react-native-elements';
import Tabs from '../Tabs';
import { getUsers, updateUser } from '../api/User';
import PrayerRequestList from './PrayerRequestList';
import * as ImagePicker from 'expo-image-picker';
import PrayersList from './PrayersList';
import { getUserPrayers } from '../api/Prayer';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { NavigationEvents } from 'react-navigation';

export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      navigation: props.navigation,
      username: '',
      createdAt: '',
      currentUserEmail: props.navigation.state.params.currentUserEmail,
      userEmail: props.navigation.state.params.userEmail,
      avatarUrl: '',
      avatarLoaded: 'loaded'
    };
  }

  componentDidMount() {
    this.retrieveUser();
  }

  retrieveUser() {
    const email = this.state.userEmail ? this.state.userEmail : this.state.currentUserEmail;
    getUsers(email).then(data => {
      this.setState({ createdAt: data.created_at, username: data.username, avatarUrl: data.avatar });
    });
  }

  _pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      base64: true,
    });

    if (!result.cancelled) {
      this.setState({ avatarLoaded: 'loading' });
      const email = this.state.userEmail ? this.state.userEmail : this.state.currentUserEmail;
      updateUser(email, result.base64, this.state.username).then(() => {
        this.setState({ avatarUrl: result.uri });
        this.setState({ avatarLoaded: 'loaded' });
      });
    }
  };

  signOut() {
    return (
      <TouchableOpacity>
        <FontAwesomeIcon icon={faSignOutAlt}
          size={16} color={ "#bbbbbb" }
          onPress={() => this.modalAlert()}
          />
      </TouchableOpacity>
    )
  }

  goToEditUser() {
    this.state.navigation.navigate('UserProfileForm', { username: this.state.username, avatarUrl: this.state.avatarUrl, email: this.state.currentUserEmail })
  }

  editUser() {
    return (
      <TouchableOpacity>
        <FontAwesomeIcon icon={faSignOutAlt}
          size={16} color={ "red" }
          onPress={() => this.goToEditUser() }
          />
      </TouchableOpacity>
    )
  }

  modalAlert() {
    Alert.alert(
    'Vous allez être déconnecté',
      'Ëtes vous sûr ?',
      [
        {
          text: 'Annuler',
          style: 'cancel',
          onPress: () => console.log('cancel pressed')
        },
        { text: 'Oui',
          onPress: () => this.state.navigation.navigate('Homepage', { signOut: true })
        }
      ],
      {cancelable: false},
    );
  }

  renderPrayerRequest() {
    return (
      <PrayerRequestList
        navigation={this.state.navigation}
        userEmail={ this.state.userEmail}
        currentUserEmail={ this.state.currentUserEmail }
        username={ this.state.username}
        profileFeed={ true }/>
    )
  }


  render() {
    const formattedDate = new Date(Date.parse(this.state.createdAt) * 1000);
    const unformattedMemberDateSince = Date.now() - Date.parse(this.state.createdAt);
    const memberSince = Math.floor(unformattedMemberDateSince/8.64e7);
    const allowsEditing = this.state.userEmail ? false : true;
    const email = this.state.userEmail ? this.state.userEmail : this.state.currentUserEmail;

    return (
      <View style={styles.container}>
        <NavigationEvents onDidFocus={payload => this.retrieveUser()} />
        { this.state.avatarUrl !== '' ?
          <Header
            containerStyle={styles.header}
            placement="center"
            rightComponent={
              this.state.avatarLoaded === 'loaded' ?
                <Avatar
                  containerStyle={styles.avatar}
                  size="large"
                  source={{
                    uri:
                      this.state.avatarUrl,
                  }}
                  rounded
                  showEditButton={ allowsEditing }
                  onEditPress={ this._pickImage }
                />
                :
                <ActivityIndicator size="large" style = {styles.loader} />
            }
          /> :
          <Text></Text>
        }
        <View style={styles.user_informations}>
        { this.state.username ? this.editUser() : <Text></Text> }

        <View style={styles.top}>
          <Text style={styles.bold} >{ this.state.username }</Text>
          { this.state.username ? this.signOut() : <Text></Text> }
        </View>
          { this.state.avatarUrl !== '' ?
            <Text>Membre depuis { memberSince } jours</Text>
            :
            <ActivityIndicator size="large" style = {styles.loader} />
          }
        </View>
        <View style={styles.container}>
          <Tabs>
            <View title="Demandes">
              { this.renderPrayerRequest() }
            </View>
            <View title="Intercessions">
              <PrayersList
                navigation={this.state.navigation}
                currentUserEmail={ this.state.currentUserEmail }
                username={ this.state.username }
                profileFeed={ true }
                requestApi={ getUserPrayers(email) }/>
            </View>
          </Tabs>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#49beb7',
  },
  avatar: {
    position: 'relative',
    top: 10,
  },
  user_informations: {
    marginTop: 20,
    marginLeft: 20,
  },
  bold: {
    fontWeight: 'bold',
    fontSize: 20,
    marginRight: 10
  },
  container: {
    height: '8%',
    flex: 1,
  },
  loader: {
    color: "red",
    flex: 1,
  },
  top: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  }
});

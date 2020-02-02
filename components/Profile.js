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
import { faPenSquare } from '@fortawesome/free-solid-svg-icons';

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
      avatarLoaded: 'loaded',
      biography: ''
    };
  }

  componentDidMount() {
    this.retrieveUser();
  }

  retrieveUser() {
    const email = this.state.userEmail ? this.state.userEmail : this.state.currentUserEmail;
    getUsers(email).then(data => {
      this.setState({ createdAt: data.created_at, username: data.username, avatarUrl: data.avatar, biography: data.biography });
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

  goToEditUser() {
    this.state.navigation.navigate('UserProfileForm', { username: this.state.username, avatarUrl: this.state.avatarUrl, email: this.state.currentUserEmail, navigation: this.state.navigation, biography: this.state.biography })
  }

  editUser() {
    return (
      <TouchableOpacity>
        <FontAwesomeIcon
          icon={faPenSquare}
          size={22}
          color={ "#bbbbbb" }
          onPress={() => this.goToEditUser()}
          />
      </TouchableOpacity>
    )
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
                  activeOpacity={0.7}
                />
                :
                <ActivityIndicator size="large" style = {styles.loader} />
            }
          /> :
          <Text></Text>
        }
        { this.state.avatarUrl !== '' ?
          <View style={styles.user_informations}>
            <View style={styles.top}>
              <Text style={styles.bold} >{ this.state.username }</Text>
              { allowsEditing ? this.editUser() : <Text></Text> }
            </View>
            { this.state.avatarUrl ?
              <Text style={styles.since}>Membre depuis { memberSince } jours</Text>
              :
              <ActivityIndicator size="large" style = {styles.loader} />
            }
            { this.state.biography ?
              <Text style={styles.biography}>{ this.state.biography }</Text>
              :
              allowsEditing ? <Text style={styles.noBiography}>Ajoutez quelques mots sur vous en cliquant sur l'icône ci-dessus !</Text>  : <Text></Text>
            }
          </View>
          :
          <Text></Text>
        }
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
    marginRight: 20
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
  },
  biography: {
    marginTop: 10
  },
  noBiography: {
    marginTop: 10,
    fontStyle: 'italic'
  },
  since: {
    color: "#bbbbbb"
  }
});

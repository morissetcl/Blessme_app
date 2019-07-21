import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Button, ActivityIndicator } from 'react-native';
import { Header, Avatar, Input, SearchBar } from 'react-native-elements';
import Tabs from '../Tabs';
import { getUsers, updateUser } from '../api/User';
import PrayerRequestList from './PrayerRequestList'
import { ImagePicker } from 'expo';

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
    const email = this.state.userEmail ? this.state.userEmail : this.state.currentUserEmail
    getUsers(email).then(data => {
      this.setState({ createdAt: data.created_at, username: data.username, avatarUrl: data.avatar });
    })
  }

  _pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      base64: true
    });

    if (!result.cancelled) {
      this.setState({ avatarLoaded: 'loading' });
      const email = this.state.userEmail ? this.state.userEmail : this.state.currentUserEmail
      updateUser(email, result.base64).then(() => {
        this.setState({ avatarUrl: result.uri });
        this.setState({ avatarLoaded: 'loaded' });
      })
    }
  };

  render() {
    const formattedDate = new Date(Date.parse(this.state.createdAt) * 1000);
    const unformattedMemberDateSince = Date.now() - Date.parse(this.state.createdAt);
    const memberSince = Math.floor(unformattedMemberDateSince/8.64e7);
    const allowsEditing = this.state.userEmail ? false : true

    return (
      <View style={styles.container}>
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
            <Text>''</Text>
          }
        <View style={styles.user_informations}>
          <Text style={styles.bold} >{ this.state.username }</Text>
          <Text>Membre depuis { memberSince } jours</Text>
        </View>
        <View style={styles.container}>
          <Tabs>
            <View title="Demandes">
              <PrayerRequestList navigation={this.state.navigation} userEmail={ this.state.userEmail} currentUserEmail={ this.state.currentUserEmail } username={ this.state.username} profileFeed={ true }/>
            </View>
            <View title="Intercessions">
              <Text>foufou</Text>
            </View>
          </Tabs>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#49beb7',
  },
  avatar: {
    position: 'relative',
    top: 10
  },
  user_informations: {
    marginTop: 20,
    marginLeft: 20
  },
  bold: {
    fontWeight: 'bold',
    fontSize: 20
  },
  container: {
    height: '8%',
    flex: 1,
  },
  loader: {
    color:"red",
    flex: 1,
  }
})

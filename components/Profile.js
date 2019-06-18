import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { Header, Avatar, Input, SearchBar } from 'react-native-elements';
import Tabs from '../Tabs';
import { getUsers } from '../api/User';
import PrayerRequestList from './PrayerRequestList'

export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      navigation: props.navigation,
      username: '',
      createdAt: '',
      currentUserEmail: props.navigation.state.params.currentUserEmail,
      userEmail: props.navigation.state.params.userEmail
    };
  }

  componentDidMount() {
    if (this.state.userEmail) {
      getUsers(this.state.userEmail).then(data => {
        this.setState({ createdAt: data.created_at, username: data.username });
      })
    } else {
      getUsers(this.state.currentUserEmail).then(data => {
        this.setState({ createdAt: data.created_at, username: data.username });
      })
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Header
          containerStyle={styles.header}
          placement="center"
          rightComponent={
            <Avatar
              containerStyle={styles.avatar}
              size="large"
              source={{
                uri:
                  'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
              }}
              rounded
            />
          }
        />
        <View style={styles.user_informations}>
          <Text style={styles.bold} >{ this.state.username }</Text>
          <Text>Inscrit depuis le { `${day}/${month}/${year}` }</Text>
        </View>
        <View style={styles.container}>
          <Tabs>
            <View title="PRIERE">
              <PrayerRequestList navigation={this.state.navigation} userEmail={ this.state.userEmail} currentUserEmail={ this.state.currentUserEmail } username={ this.state.username} profileFeed={ true }/>
            </View>
            <View title="INTERCESSION">
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
    top: 0
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
})

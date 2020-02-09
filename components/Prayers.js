import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import PrayerRequestList from './PrayerRequestList';
import PrayersList from './PrayersList';
import HeaderHomepage from './HeaderHomepage';
import Tabs from '../Tabs';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPenSquare, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { createUser, getUsers } from '../api/User';
import registerForNotifications from '../services/notifications';
import { getAllPrayers } from '../api/Prayer';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export default class Prayers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      navigation: this.props.navigation,
      currentUserEmail: this.props.currentUserEmail,
      username: this.props.username,
      avatarUrl: ''
    };
  }

  retrieveUser() {
    getUsers(this.state.currentUserEmail).then(data => {
      this.setState({ avatarUrl: data.avatar });
    });
  }

  componentWillMount() {
    createUser({ currentUserEmail: this.state.currentUserEmail, username: this.state.username });
    this.retrieveUser();
    registerForNotifications(this.state.currentUserEmail);
  }

  render() {
    return (
      <View style={styles.container}>
        <HeaderHomepage
          navigation={this.state.navigation}
          currentUserEmail={ this.state.currentUserEmail }
          avatarUrl={ this.state.avatarUrl }
          username={ this.state.username }/>
        <View style={styles.container}>
          <Tabs>
            <View title="Demandes" style={styles.content}>
              <PrayerRequestList
                navigation={this.state.navigation}
                currentUserEmail={ this.state.currentUserEmail }
                username={ this.state.username }
                profileFeed={ false }/>
            </View>
            <View title="Intercessions" style={styles.content}>
              <PrayersList
                navigation={this.state.navigation}
                currentUserEmail={ this.state.currentUserEmail }
                username={ this.state.username }
                profileFeed={ false }
                requestApi={ getAllPrayers() }/>
            </View>
          </Tabs>
        </View>
        <View style = {styles.bottom_buttons}>
          <TouchableOpacity>
            <FontAwesomeIcon
              icon={ faPlusCircle }
              size={36} color={ '#FFFFFF' }
              style = {styles.add_prayer}
              onPress={(value) => {
                this.state.navigation.navigate('PrayerRequestForm', { currentUserEmail: this.state.currentUserEmail, prayerRequest: ''});
              }}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  add_prayer: {
    borderRadius: 30,
    backgroundColor: '#ff8b6a',
    padding: 15,
  },
  bottom_buttons: {
    backgroundColor: '#fafafa',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    height: '7%',
    alignItems: 'center',
    elevation: 1,
    height: hp('7%')
  },
  container: {
    height: '8%',
    flex: 1,
  },
  content: {
    flex: 1,
    backgroundColor: '#eaeaea'
  },
});

import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Dimensions } from 'react-native';
import PrayerRequestList from './PrayerRequestList';
import PrayersList from './PrayersList';
import HeaderHomepage from './HeaderHomepage';
import Tabs from '../Tabs';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPenSquare, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { createUser, getUsers } from '../api/User';
import { getAllPrayers } from '../api/Prayer';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import * as Localization from 'expo-localization';
import i18n from 'i18n-js';

export default class Prayers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      navigation: this.props.navigation,
      currentUserToken: this.props.currentUserToken,
      username: this.props.username,
      avatarUrl: ''
    };
  }

  retrieveUser() {
    getUsers(this.state.currentUserToken).then(data => {
      if(data != undefined) {
        this.setState({ avatarUrl: data.avatar });
      }
    });
  }

  componentDidMount() {
    this.retrieveUser();
  }

  render() {
    i18n.locale = Localization.locale;
    i18n.fallbacks = true;

    i18n.translations = {
      fr: {
            request: "Demandes",
            intercession: "Intercessions"
          },
      en: {
            request: "Requests",
            intercession: 'Intercessions'
          }
    };

    return (
      <View style={styles.container}>
        <HeaderHomepage
          navigation={this.state.navigation}
          currentUserToken={ this.state.currentUserToken }
          avatarUrl={ this.state.avatarUrl }
          username={ this.state.username }/>
        <View style={styles.container}>
          <Tabs>
            <View title= { i18n.t('request') } style={styles.content}>
              <PrayerRequestList
                navigation={this.state.navigation}
                currentUserToken={ this.state.currentUserToken }
                token={ this.state.token }
                username={ this.state.username }
                profileFeed={ false }/>
            </View>
            <View title= { i18n.t('intercession') } style={styles.content}>
              <PrayersList
                navigation={this.state.navigation}
                currentUserToken={ this.state.currentUserToken }
                token={ this.state.token }
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
                this.state.navigation.navigate('PrayerRequestForm', { token: this.state.currentUserToken, prayerRequest: ''});
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
    borderWidth: 2,
    borderColor: 'transparent',
    borderTopColor: '#eaeaea'
  },
  container: {
    height: '8%',
    flex: 1,
    width: Dimensions.get('window').width
  },
  content: {
    flex: 1,
    backgroundColor: '#eaeaea'
  },
});

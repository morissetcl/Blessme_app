import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Dimensions, KeyboardAvoidingView } from 'react-native';
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
import { connect } from 'react-redux';

class Prayers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      navigation: this.props.navigation,
      username: this.props.username,
      avatarUrl: '',
    };
  }

  retrieveUser() {
    getUsers(this.props.currentUser).then(data => {
      if (data !== undefined) {
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
        intercession: "Intercessions",
      },
      en: {
        request: "Requests",
        intercession: 'Intercessions',
      },
    };

    return (
      <View style={styles.container}>
        <HeaderHomepage
          navigation={this.state.navigation}
          avatarUrl={ this.state.avatarUrl }
          username={ this.state.username }/>
        <View style={styles.container}>
          <Tabs>
            <View title= { i18n.t('request', { defaultValue: 'Requests' }) } style={styles.content}>
              <PrayerRequestList
                displayDeleteAction={false}
                navigation={this.state.navigation}
                currentUserToken={ this.props.currentUser }
                token={ this.state.token }
                username={ this.state.username }
                profileFeed={ false }/>
            </View>
            <View title= { i18n.t('intercession', { defaultValue: 'Intercessions' }) } style={styles.content}>
              <PrayersList
                navigation={this.state.navigation}
                currentUserToken={ this.props.currentUser }
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
                this.state.navigation.navigate('PrayerRequest', {
                  token: this.props.currentUser,
                  prayerRequest: ''
                });
                }}
                />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: Dimensions.get('window').width,
  },
  content: {
    flex: 1,
    backgroundColor: '#eaeaea',
  },
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
    height: 60,
    alignItems: 'center',
    elevation: 1,
    borderWidth: 2,
    borderColor: 'transparent',
    borderTopColor: '#eaeaea',
  },
});

const mapStateToProps = (state, ownProps) => {
  return {
    allPrayersRequests: state.prayerRequestReducer.data,
    currentUser: state.userReducer.data
  }
}

export default connect(mapStateToProps)(Prayers)

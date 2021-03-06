import React, { Component } from 'react';
import { StyleSheet, View, Text, StatusBar, Dimensions } from 'react-native';
import { Header, Avatar, SearchBar, Button } from 'react-native-elements';
import { NavigationEvents } from 'react-navigation';
import { getUsers } from '../api/User';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as firebase from "firebase";
import * as Localization from 'expo-localization';
import i18n from 'i18n-js';
import { loadPrayersRequests } from '../store/actions/actionCreators'
import { getPrayerRequests } from '../api/PrayerRequest'

class HeaderHomepage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      navigation: props.navigation,
      username: this.props.username,
      avatarUrl: undefined,
      search: '',
    };
  }

  componentDidMount() {
    this.retrieveUser(this.props.currentUser);
  }

  retrieveUser() {
    getUsers(this.props.currentUser).then(data => {
      if (data !== undefined) {
        this.setState({ avatarUrl: data.avatar });
      }
    });
  }

  openProfile(prayerId) {
    this.state.navigation.navigate('Profile', {
      currentUserToken: this.props.currentUser,
      username: this.state.username
    });
  }

  updateSearch(e) {
    this.setState({
      search: e,
    }, () => {
      getPrayerRequests(e).then(response => {
        this.props.dispatch(loadPrayersRequests(response.prayers_requests))
      });
    });
  }

  searchBar() {
    return (
      <SearchBar
        inputStyle={styles.inputStyle}
        containerStyle={styles.containerStyle}
        inputContainerStyle={styles.inputContainerStyle}
        placeholder={i18n.t('search', { defaultValue: 'Your search...' })}
        round={true}
        placeholderTextColor={styles.placeholderTextColor}
        onChangeText={this.updateSearch.bind(this)}
        value={this.state.search}
      />
    );
  }

  render() {
    i18n.locale = Localization.locale;
    i18n.fallbacks = true;

    i18n.translations = {
      fr: {
        search: 'Votre recherche...',
      },
      en: {
        search: 'Search prayer by keyword.',
      },
    };

    return (
      <View style={styles.container}>
        <NavigationEvents onDidFocus={payload => this.retrieveUser(this.props.currentUser)} />
        <Header
          containerStyle={styles.header}
          placement="left"
          centerComponent={this.searchBar()}
          leftComponent={
            this.state.avatarUrl ?
              <Avatar rounded source={{ uri: this.state.avatarUrl }} onPress={(value) => {
                this.openProfile();
              }} />
              :
              <Avatar rounded title='?' onPress={(value) => {
                this.openProfile();
              }} />
          }
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#49beb7',
    paddingLeft: 16
  },
  container: {
    height: Dimensions.get('window').height / 13,
  },
  inputStyle: {
    height: '80%',
    backgroundColor: 'white',
    color: 'black',
    fontSize: 12,
  },
  containerStyle: {
    paddingTop: '4%',
    height: '100%',
    backgroundColor: '#49beb7',
    width: '100%',
    borderBottomWidth: 0,
    borderTopWidth: 0,
  },
  inputContainerStyle: {
    height: '80%',
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 15,
  },
});

function mapStateToProps(state) {
  return {
    allPrayersRequests: state.prayerRequestReducer,
    currentUser: state.userReducer.data
  };
}

const mapDispatchToProps = dispatch => ({
   dispatch
});

export default connect(mapStateToProps, mapDispatchToProps)(HeaderHomepage);

import React, { Component } from 'react';
import { StyleSheet, View, Text, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { NavigationEvents } from 'react-navigation';
import { Header, Avatar } from 'react-native-elements';
import Tabs from '../Tabs';
import { getUsers, updateUser } from '../api/User';
import PrayerRequestList from './PrayerRequestList';
import * as ImagePicker from 'expo-image-picker';
import PrayersList from './PrayersList';
import { getUserPrayers } from '../api/Prayer';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPenSquare } from '@fortawesome/free-solid-svg-icons';
import * as Localization from 'expo-localization';
import i18n from 'i18n-js';
import { connect } from 'react-redux';

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      navigation: props.navigation,
      username: '',
      createdAt: '',
      userToken: props.navigation.state.params.userToken,
      avatarUrl: '',
      avatarLoaded: true,
      biography: '',
    };
  }

  componentDidMount() {
    this.retrieveUser();
  }

  retrieveUser() {
    const token = this.state.userToken ? this.state.userToken : this.props.currentUser;
    getUsers(token).then(data => {
      if (data !== undefined) {
        this.setState({ createdAt: data.created_at,
          username: data.username,
          avatarUrl: data.avatar,
          biography: data.biography });
      }
    });
  }

  _pickImage = async () => {
    if (this.state.userToken) return;

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      base64: true,
    });

    if (!result.cancelled) {
      this.setState({ avatarLoaded: false });
      const token = this.state.userToken ? this.state.userToken : this.props.currentUser;
      updateUser({
        email: token,
        avatar: result.base64,
        username: this.state.username,
        navigation: this.state.navigation }).then(() => {
        this.setState({ avatarUrl: result.uri });
        this.setState({ avatarLoaded: true });
      });
    }
  };

  goToEditUser() {
    this.state.navigation.navigate('UserProfile', {
      username: this.state.username,
      avatarUrl: this.state.avatarUrl,
      email: this.props.currentUser,
      navigation: this.state.navigation,
      biography: this.state.biography });
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
    );
  }

  renderPrayerRequest() {
    return (
      <PrayerRequestList
        displayDeleteAction={true}
        navigation={this.state.navigation}
        userToken={ this.state.userToken}
        currentUserToken={ this.props.currentUser }
        username={ this.state.username}
        profileFeed={ true }/>
    );
  }

  render() {
    i18n.locale = Localization.locale;
    i18n.fallbacks = true;

    i18n.translations = {
      fr: {
        request: 'Demandes',
        intercession: 'Intercessions',
        firstDay: 'Premier jour parmis nous !',
        addSomeWords: "Ajoutez quelques mots sur vous en cliquant sur l'icône ci-dessus !",
        memberSince: "Membre depuis",
        days: 'jours',
      },
      en: {
        request: 'Requests',
        intercession: 'Intercessions',
        firstDay: 'First day among us !',
        addSomeWords: 'Add some words about you by clicking on the pencil above',
        memberSince: "Member for",
        days: 'days',
      },
    };

    const formattedDate = new Date(Date.parse(this.state.createdAt) * 1000);
    const unformattedMemberDateSince = Date.now() - Date.parse(this.state.createdAt);
    const memberSince = Math.floor(unformattedMemberDateSince/8.64e7);
    const allowsEditing = this.state.userToken ? false : true;
    const token = this.state.userToken ? this.state.userToken : this.props.currentUser;
    const date = `${i18n.t('memberSince', { defaultValue: '' })} ${memberSince} ${i18n.t('days')}`;

    return (
      <View style={styles.container}>
        <NavigationEvents onDidFocus={payload => this.retrieveUser()} />
          <View>
            <Header
              containerStyle={styles.header}
              placement="center"
              rightComponent={
                this.state.avatarLoaded ?
                  <Avatar
                    containerStyle={styles.avatar}
                    size="large"
                    source={{
                      uri:
                        this.state.avatarUrl,
                    }}
                    rounded
                    showEditButton={ allowsEditing }
                    activeOpacity={0.7}
                    onPress={ this._pickImage }
                  />
                :
                <ActivityIndicator size="large" color="white" />
              }
            />
            <View style={styles.user_informations}>
              <View style={styles.top}>
                <Text style={styles.bold} >{ this.state.username }</Text>
                { allowsEditing ? this.editUser() : null }
              </View>
              <Text style={styles.since}>
                { memberSince ? date : i18n.t('firstDay', { defaultValue: 'First day' }) }
              </Text>
              { this.state.biography ?
                <Text style={styles.biography}>{ this.state.biography }</Text>
                :
                allowsEditing ? <Text style={styles.noBiography}>
                  { i18n.t('addSomeWords', { defaultValue: 'Add some words' }) }
                </Text> : null
              }
            </View>
          </View>
        <View style={styles.container}>
          <Tabs>
            <View title={ i18n.t('request', { defaultValue: 'Requests' }) }>
              { this.renderPrayerRequest() }
            </View>
            <View title={ i18n.t('intercession', { defaultValue: 'Intercessions' }) }>
              <PrayersList
                navigation={this.state.navigation}
                username={ this.state.username }
                profileFeed={ true }
                requestApi={ getUserPrayers(token) }/>
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
    marginRight: 20,
  },
  bold: {
    fontWeight: 'bold',
    fontSize: 20,
    marginRight: 10,
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
    alignItems: 'center',
  },
  biography: {
    marginTop: 10,
  },
  noBiography: {
    marginTop: 10,
    fontStyle: 'italic',
  },
  since: {
    color: "#bbbbbb",
  },
});


function mapStateToProps(state) {
  return {
    currentUser: state.userReducer.data
  };
}

export default connect(mapStateToProps)(Profile);

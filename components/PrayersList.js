import React from 'react';
import { ScrollView, StyleSheet, View, ActivityIndicator, Text, TouchableOpacity, Dimensions } from 'react-native';
import { NavigationEvents } from 'react-navigation';
import AudioPrayer from './prayers/audio/Prayer';
import * as Localization from 'expo-localization';
import i18n from 'i18n-js';

export default class PrayersList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      prayers: [],
      navigation: this.props.navigation,
      currentUserToken: this.props.currentUserToken,
      profileFeed: this.props.profileFeed,
      prayersList: [],
      requestApi: this.props.requestApi,
    };
  }

  componentDidMount() {
    this.retrieveAllPrayers();
  }

  goToPrayerRequest(prayerRequest) {
    this.state.navigation.navigate('Prayer', { prayerRequest: prayerRequest, currentUserToken: this.state.currentUserToken });
  }

  retrieveAllPrayers() {
    this.state.requestApi.then(data => {
      this.state.prayers.push(data.comments);
      const prayers = this.state.prayers.length > 0 ? this.state.prayers[0] : [''];
      this.setState({ prayersList:
        prayers.map((response, index) => {
          const dateOfCreatedAt = Math.floor(Date.parse(response.created_at)/8.64e7)

          const now = Math.floor(Date.now()/8.64e7)
          const checkDate = now - dateOfCreatedAt;
          const goodDate = isNaN(checkDate) ? '-' : checkDate
          const trad = `Il y a ${goodDate} jours`;
          const formattedCreatedAtSince = (checkDate !== 0) ? trad : i18n.t('today', { defaultValue: "Aujourd'hui" });
          return <View style={styles.comment_card} key={index} id={index}>
            <Text
              style={styles.username}
            >{response.user.username}</Text>
            <Text style = {styles.created_at}>{ formattedCreatedAtSince }</Text>
            <TouchableOpacity>
              { response.body ?
                <Text onPress={(value) => {
                  this.goToPrayerRequest(response.prayer_request);
                }}>
                  {response.body}
                </Text>
                :
                <AudioPrayer audio={response.audio} duration={response.audio_duration} />
              }
            </TouchableOpacity>
          </View>;
        }),

      });
    });
  }

  render() {
    i18n.locale = Localization.locale;
    i18n.fallbacks = true;

    i18n.translations = {
      fr: {
        prayerDate: "Il y a {{ createdAtSince }} jours",
        today: "Aujourd'hui",
      },
      en: {

        prayerDate: "{{createdAtSince}} days ago",
        today: 'Today',
      },
    };

    return (
      <View style={ this.state.profileFeed ?
        styles.container_prayer_request_card :
        styles.container_prayer_request_card_with_margin
      }>
        <NavigationEvents onDidFocus={payload => this.retrieveAllPrayers()} />
        { this.state.prayers.length > 0 ?
          <ScrollView>
            { this.state.prayersList }
          </ScrollView>
          :
          <ActivityIndicator size="large" style = {styles.loader} />
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container_prayer_request_card: {
    backgroundColor: '#eaeaea',
    height: '100%',
    paddingTop: '2%',
  },
  container_prayer_request_card_with_margin: {
    paddingTop: '2%',
    paddingBottom: '6%',
    height: Dimensions.get('window').height - Dimensions.get('window').height / 5
  },
  comment_card: {
    padding: '2%',
    backgroundColor: 'white',
    marginBottom: '2%',
  },
  username: {
    fontWeight: 'bold',
    color: '#63686e',
    marginBottom: '2%',
  },
  loader: {
    color: "#0000ff",
    flex: 1,
    alignItems: 'center',
    position: 'absolute',
    top: 200,
    left: 150,
  },
  created_at: {
    position: 'absolute',
    top: 8,
    right: 10,
    fontSize: 12,
    color: '#bbbbbb',
  },
});

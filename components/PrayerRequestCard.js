import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Avatar, Card, Divider } from 'react-native-elements';
import ModalActions from './ModalActions';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPenSquare, faComment, faMicrophone } from '@fortawesome/free-solid-svg-icons';
import { getPrayers } from '../api/Prayer';
import { NavigationEvents } from 'react-navigation';
import { getPrayerRequest } from '../api/PrayerRequest';
import * as Localization from 'expo-localization';
import i18n from 'i18n-js';

export default class PrayerRequestCard extends React.Component {
  constructor(props) {
    super(props);
    const prayerRequest = this.props.prayerRequest;
    this.state = {
      title: this.findPrayerRequest().title,
      body: this.findPrayerRequest().body,
      user: this.findPrayerRequest().user,
      username: this.findPrayerRequest().user.username,
      avatarUrl: this.findPrayerRequest().user.avatar,
      categoryLabel: this.checkCategoryLabel(this.findPrayerRequest().category),
      categoryColor: this.findPrayerRequest().category.color,
      userToken: this.findPrayerRequest().user.token,
      createdAt: this.findPrayerRequest().created_at,
      numberOfAudioPrayer: this.findPrayerRequest().audios_count,
      numberOfWritingPrayer: this.findPrayerRequest().writings_count,
      prayerId: this.findPrayerRequest().id,
      currentUserToken: this.props.currentUserToken,
      navigation: this.props.navigation,
      numberOfLines: this.props.numberOfLines,
      displayDeleteAction: this.props.displayDeleteAction,
      needLink: this.props.needLink,
      prayerRequest: [],
      loaded: false,
    };
  }

  findPrayerRequest() {
    return this.props.prayerRequest ? this.props.prayerRequest : this.props.navigation.state.params.prayerRequest
  }

  componentDidMount() {
    this.setState({ loaded: false });
    this.setState({ loaded: true });
  }

  checkCategoryLabel(category) {
    if (category !== undefined) {
      return Localization.locale === 'fr-FR' ? category.label : category.translation;
    }
  }

  updateCounter(prId) {
    if (this.props.navigation.state.routeName !== 'Connexion') {
      getPrayerRequest(prId).then(data => {
        this.setState({
          numberOfWritingPrayer: data.writings_count,
          numberOfAudioPrayer: data.audios_count,
        }, function () {});
      });
    }
  }

  goToPrayer() {
    if (this.state.needLink) {
      this.state.navigation.navigate('Prayer', {
        prayerRequest: this.props.prayerRequest,
        currentUserToken: this.state.currentUserToken,
        prayerRequestUsername: this.state.username,
      });
    }
  }

  goToProfile(username) {
    this.state.navigation.navigate('Profile', { username: username,
      userToken: this.state.user.token,
      currentUserToken: this.state.currentUserToken,
    });
  }

  counter() {
    if (!this.needLink) {
      return <NavigationEvents onDidFocus={ payload => this.updateCounter(this.state.prayerId) } />;
    }
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

    const avatar = this.state.avatarUrl ? this.state.avatarUrl : undefined;
    const dateOfCreatedAt = Math.floor(Date.parse(this.state.createdAt)/8.64e7)
    const now = Math.floor(Date.now()/8.64e7)
    const checkDate = now - dateOfCreatedAt;
    const goodDate = isNaN(checkDate) ? '-' : checkDate
    const trad = `Il y a ${goodDate} jours`;
    const formattedCreatedAtSince = (checkDate !== 0) ? trad : i18n.t('today', { defaultValue: "Aujourd'hui" });

    return (

      <TouchableOpacity activeOpacity={0.7}
        onPress={(value) => {
          this.goToPrayer(this.state.prayerId);
        }}
        style = {styles.space_between_card}>
        { this.counter() }
        { this.state.loaded ?
          <Card containerStyle={{ width: '100%', marginLeft: 0 }} title={<Avatar rounded source={{ uri: avatar }}
            onPress={() => {
              this.goToProfile(this.state.username);
            }} />}>
            <Text style = {styles.username} > {this.state.username}</Text>
            <Text style = {styles.created_at}>{ formattedCreatedAtSince }</Text>
            { (this.state.userToken === this.state.currentUserToken) && this.state.displayDeleteAction ?
              <ModalActions
                currentUserToken={ this.state.currentUserToken }
                navigation={ this.state.navigation }
                body={ this.state.body }
                title={ this.state.title }
                category={ this.state.categoryLabel }
                username={ this.state.username }
                prayerId={ this.state.prayerId }
              />
              :
              null
            }

            { (this.state.userToken !== this.state.currentUserToken) && this.state.displayDeleteAction ?
              <ModalActions
                signal={true}
                currentUserToken={ this.state.currentUserToken }
                navigation={ this.state.navigation }
                body={ this.state.body }
                title={ this.state.title }
                category={ this.state.categoryLabel }
                username={ this.state.username }
                prayerId={ this.state.prayerId }
              />
              :
              null
            }

            <Text style = {styles.card_title}> {this.state.title}</Text>
            <Text style = {styles.body_request} numberOfLines={this.state.numberOfLines}>{this.state.body}</Text>

            <View style = {styles.card_actions}>
              <TouchableOpacity>
                <View style = {styles.comment_action_card_contenair}>
                  <FontAwesomeIcon icon={ faComment } size={12} color={ '#ff8b6a' } style = {styles.button}/>
                  <Text style = {styles.number_of_comment}>{ this.state.numberOfWritingPrayer }</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity>
                <View style = {styles.comment_action_card_contenair}>
                  <FontAwesomeIcon icon={ faMicrophone } size={12} color={ '#ff8b6a' } style = {styles.button}/>
                  <Text style = {styles.number_of_comment}>{ this.state.numberOfAudioPrayer }</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity>
                <View style = {styles.comment_action_card_contenair}>
                  <Text style = {[styles.categoryLabel, { backgroundColor: this.state.categoryColor }]}>
                    { this.state.categoryLabel }
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </Card>
          :
          null
        }

      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  space_between_card: {
    marginTop: -10,
  },
  number_of_comment: {
    marginLeft: 10,
    color: '#ff8b6a',
    fontWeight: 'bold',
  },
  comment_action_card_contenair: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  username: {
    position: 'absolute',
    top: 8,
    left: 40,
    fontWeight: 'bold',
    color: '#bbbbbb',
  },
  card_title: {
    textAlign: 'center',
    marginTop: 10,
    fontWeight: 'bold',
    color: '#63686e',
  },
  created_at: {
    position: 'absolute',
    top: 8,
    right: 30,
    fontSize: 12,
    color: '#bbbbbb',
  },
  button: {
    padding: 10,
  },
  body_request: {
    marginTop: 20,
    marginBottom: 20,
  },
  card_actions: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    position: 'relative',
    top: 10,
    paddingBottom: 10,
  },
  categoryLabel: {
    borderRadius: 30,
    color: 'white',
    paddingLeft: 8,
    paddingRight: 6,
    paddingTop: 3,
    paddingBottom: 4,
    position: 'relative',
    fontSize: 12,
  },
});

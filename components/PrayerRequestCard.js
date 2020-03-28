import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Avatar, Card, Divider } from 'react-native-elements';
import  ModalActions  from './ModalActions';
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
    this.state = {
      prayerId: this.props.prayerId,
      category_color: 'white',
      navigation: this.props.navigation,
      numberOfLines: this.props.numberOfLines,
      needLink: this.props.needLink,
      currentUserToken: this.props.currentUserToken,
      displayDeleteAction: this.props.displayDeleteAction,
      prayerRequest: [],
      loaded: false
    };
  }

  componentDidMount() {
    this.setState({loaded: false})
    const preventPrayerId = this.state.prayerId ? this.state.prayerId : this.props.navigation.state.params.prayerRequestId
    getPrayerRequest(preventPrayerId).then(data => {
      this.setState({
        title: data.title,
        body: data.body,
        user: data.user,
        username: data.user.username,
        avatarUrl: data.user.avatar,
        prayerId: data.id,
        userToken: data.user.token,
        category_label: this.checkCategoryLabel(data),
        category_color: data.category.color,
        createdAt: data.created_at,
        numberOfWritingPrayer: data.writings_count,
        numberOfAudioPrayer: data.audios_count
      }, function () {});
    });
    this.setState({loaded: true})
  };

  checkCategoryLabel(data) {
    return Localization.locale == 'fr' ? data.category.label : data.category.translation
  };

  updateCounter(prId) {
    getPrayerRequest(prId).then(data => {
      this.setState({
        numberOfWritingPrayer: data.writings_count,
        numberOfAudioPrayer: data.audios_count
      }, function () {});
    });
  };

  goToPrayer() {
    if (this.state.needLink) {
      this.state.navigation.navigate('Prayer', { prayerId: this.props.prayerId, currentUserToken: this.state.currentUserToken, prayerRequestUsername: this.state.username
      });
    };
  };

  goToProfile(username) {
    this.state.navigation.navigate('Profile', { username: username, userToken: this.state.userToken, currentUserToken: this.state.currentUserToken
    });
  }

  render() {
    i18n.locale = Localization.locale;
    i18n.fallbacks = true;

    i18n.translations = {
      fr: {
            prayerDate: "Il y a {{ createdAtSince }} jours",
            today: "Aujourd'hui"
          },
      en: {
            prayerDate: "{{createdAtSince}} days ago",
            today: 'Today'
          }
    };

    const avatar = this.state.avatarUrl ? this.state.avatarUrl : undefined;
    const formattedDate = new Date(Date.parse(this.state.createdAt) * 1000);
    const unformattedCreatedDateSince = Date.now() - Date.parse(this.state.createdAt);
    const createdAtSince = Math.floor(unformattedCreatedDateSince/8.64e7);

    const checkDate = (isNaN(createdAtSince) || createdAtSince === -1) ? '-' : createdAtSince
    const trad = i18n.t('prayerDate', { createdAtSince: checkDate,  defaultValue: '-' })
    const formattedCreatedAtSince = (createdAtSince !== 0) ? trad : i18n.t('today', { defaultValue: 'Email' });

    return (
      <TouchableOpacity activeOpacity={0.7}
        onPress={(value) => { this.goToPrayer(this.state.prayerId); }}
        style = {styles.space_between_card}>
        <NavigationEvents onDidFocus={ payload => this.updateCounter(this.state.prayerId) } />
        { this.state.loaded ?
          <Card containerStyle={{ width: '100%', marginLeft: 0}} title={<Avatar rounded source={{ uri: avatar }}
            onPress={() => { this.goToProfile(this.state.username); }} />}>
            <Text style = {styles.username} > {this.state.username}</Text>
            <Text style = {styles.created_at}>{ formattedCreatedAtSince }</Text>

            {((this.state.userToken === this.state.currentUserToken) && this.state.displayDeleteAction) ?
              <ModalActions
                currentUserToken={ this.state.currentUserToken }
                navigation={ this.state.navigation }
                body={ this.state.body }
                title={ this.state.title }
                category={ this.state.category_label }
                username={ this.state.username }
                prayerId={ this.state.prayerId }
              />
              :
              <Text></Text>
            }

            <Text style = {styles.card_title}> {this.state.title}</Text>
            <Text style = {styles.body_request} numberOfLines={this.state.numberOfLines}>{this.state.body}</Text>

            <View style = {styles.card_actions}>
              <TouchableOpacity>
                <View style = {styles.comment_action_card_contenair}>
                  <FontAwesomeIcon icon={ faComment } size={24} color={ '#ff8b6a' } style = {styles.button}/>
                  <Text style = {styles.number_of_comment}>{ this.state.numberOfWritingPrayer }</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity>
                <View style = {styles.comment_action_card_contenair}>
                  <FontAwesomeIcon icon={ faMicrophone } size={24} color={ '#ff8b6a' } style = {styles.button}/>
                  <Text style = {styles.number_of_comment}>{ this.state.numberOfAudioPrayer }</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity>
                <View style = {styles.comment_action_card_contenair}>
                  <Text style = {[styles.category_label, { backgroundColor: this.state.category_color }]}>{ this.state.category_label }</Text>
                </View>
              </TouchableOpacity>
            </View>
          </Card>
        :
        <Text></Text>
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
  category_label: {
    borderRadius: 30,
    color: 'white',
    paddingLeft: 8,
    paddingRight: 6,
    paddingTop: 3,
    paddingBottom: 4,
    position: 'relative',
    fontSize: 12
  }
});

import React, { Component } from 'react';
import { ScrollView, StyleSheet, View, Text, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { NavigationEvents } from 'react-navigation';

import { getPrayerRequest } from '../../api/PrayerRequest';
import { getPrayers } from '../../api/Prayer';
import { createInnapropriateContent } from '../../api/InnapropriateContent';
import { displayMessage } from "../shared/message";
import { styles } from './Styles';
import { connect } from 'react-redux';
import { updateCounter } from '../../store/actions/actionCreators'

import * as Expo from 'expo';
import * as Localization from 'expo-localization';

import PrayerRequestCard from '../PrayerRequestCard';
import PrayerRequestButtonsActions from '../prayerRequest/PrayerRequestButtonsActions';

import WritingComment from '../form/WritingComment/WritingComment';
import WritingPrayer from '../prayers/writing/Prayer';

import i18n from 'i18n-js';

class PrayerRequest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      prayerId: props.navigation.state.params.prayerRequest.id,
      loaded: false,
      prayerRequest: [],
      navigation: props.navigation,
      username: props.navigation.state.params.username,
      prayers: [],
      prayersList: [],
      flashMessage: true,
      prayerRequestUsername: props.navigation.state.params.prayerRequestUsername,
    };
  }

  componentDidUpdate() {
    if (this.props.navigation.state.params.destroyPrayer && this.state.flashMessage) {
      this.retrieveAllPrayers(this.state.prayerId);
      this.setState({ flashMessage: false });
    }
  }

  renderPrayerRequest() {
    const pr = this.props.allPrayersRequests.filter(pr => pr.id === this.state.prayerId)
    if (this.props.navigation.state.params.editedPr && this.props.allPrayersRequests) {
      return <PrayerRequestCard
        key={ Math.random() }
        prayerRequest={pr[0]}
        numberOfLines={ 1000 }
        navigation={ this.state.navigation }
        prayerId={ this.props.navigation.state.params.prayerId }
        showView={true} />;
    } else {
      return <PrayerRequestCard
        key={ Math.random() }
        prayerRequest={pr[0]}
        numberOfLines={ 1000 }
        navigation={ this.state.navigation }
        prayerId={ this.props.navigation.state.params.prayerId }
        newPrayer={this.props.navigation.state.params.newPrayer}
      />;
    }
  }

  signalContent(alertableId) {
    const trad = i18n.t('signalSuccess', { defaultValue: 'Signalé avec succès' });
    createInnapropriateContent({
      alertableId: alertableId,
      object: 'prayer'
    })
    displayMessage(trad, 'success');
  }

  retrieveAllPrayers(prayerId) {
    this.setState({ prayers: [] });
    getPrayers(prayerId).then(data => {
      this.state.prayers.push(data.prayer_request_comments);
      const prayers = this.state.prayers.length > 0 ? this.state.prayers[0] : [''];
      const prayersList = prayers.map((response, index) => {
        const formattedDate = new Date(Date.parse(response.created_at) * 1000);
        const unformattedCreatedDateSince = Date.now() - Date.parse(response.created_at);
        const createdAtSince = Math.floor(unformattedCreatedDateSince/8.64e7);
        const trad = i18n.t('prayerDate', { createdAtSince: createdAtSince, defaultValue: '-' });
        const formattedCreatedAtSince = (createdAtSince !== 0) ? trad : i18n.t('today', { defaultValue: 'Today' });

        return <View key={Math.random()}>
                 <WritingPrayer
                   index={index}
                   response={response}
                   currentUser={this.props.currentUser}
                   navigation={this.state.navigation}
                   username={this.state.username}
                   prayerId={this.state.prayerId}
                   prayerRequest={this.state.prayerRequest}
                   prayerRequestUsername={this.state.prayerRequestUsername}
                 />
              </View>
      });
      this.setState({ prayersList: prayersList });
      this.setState({ loaded: true });
    });
  }

  render() {
    i18n.locale = Localization.locale;
    i18n.fallbacks = true;

    i18n.translations = {
      fr: {
        success: 'Votre prière a bien été ajoutée.',
        edit: 'Modifier',
        delete: 'Supprimer',
        destroyPrayer: 'Votre prière a bien été supprimée.',
        prayerDate: "Il y a {{ createdAtSince }} jours",
        today: "Aujourd'hui",
        areYouSurePr: 'Supprimer votre prière ?',
      },
      en: {
        success: 'Yous prayer has been added.',
        edit: 'Edit',
        delete: 'Delete',
        cancel: 'Cancel',
        destroyPrayer: 'Your prayer has been removed.',
        prayerDate: "{{ createdAtSince }} days ago",
        today: "Today",
        areYouSurePr: 'Remove you prayer ?',
      },
    };
    return (
      <View style={styles.container}>
        <NavigationEvents onDidFocus={payload => this.retrieveAllPrayers(this.state.prayerId)} />
        <ScrollView>
          <View style={styles.prayerCard} >
            { this.renderPrayerRequest() }
            <View style={styles.prayerList} >
              { this.state.prayersList }
            </View>
          </View>
        </ScrollView>
        { this.state.loaded ?
          <PrayerRequestButtonsActions
            prayerRequest={ this.state.prayerRequest }
            prayerId={ this.state.prayerId }
            currentUserToken={ this.props.currentUser }
            navigation={ this.state.navigation }/>
          :
          <ActivityIndicator size="large" style = {styles.loader} />
        }
      </View>
    );
  }
}

const mapDispatchToProps = dispatch => ({
   dispatch
});

const mapStateToProps = (state) => {
  return {
    allPrayersRequests: state.prayerRequestReducer.data,
    currentUser: state.userReducer.data
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PrayerRequest)

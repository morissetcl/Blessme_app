import React from 'react';
import { ScrollView, StyleSheet, View, Image, ActivityIndicator, RefreshControl } from 'react-native';
import { getAllPrayersRequests, getUserPrayersRequests } from '../api/PrayerRequest';
import PrayerRequestCard from './PrayerRequestCard';

export default class PrayerRequestList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      prayersRequests: [],
      loaded: false,
      navigation: this.props.navigation,
      currentUserEmail: this.props.currentUserEmail,
      refreshing: false,
      profileFeed: this.props.profileFeed,
      userEmail: this.props.userEmail,
    };
  }

  componentDidMount() {
    this.retrievePrayersRequests();
  }

  _onRefresh = () => {
    this.setState({ refreshing: true });
    this.setState({ prayersRequests: [] });
    this.retrievePrayersRequests();
    this.setState({ refreshing: false });
  }

  checkEmailToSearch() {
    if (this.state.userEmail !== undefined) {
      return this.state.userEmail;
    } else {
      return this.state.currentUserEmail;
    }
  }

  retrievePrayersRequests() {
    if (this.state.profileFeed) {
      getUserPrayersRequests(this.checkEmailToSearch()).then(data => {
        this.state.prayersRequests.push(data.user_prayers_requests);
        this.setState({ loaded: true });
      });
    } else {
      getAllPrayersRequests().then(data => {
        this.state.prayersRequests.push(data.prayers_requests);
        this.setState({ loaded: true });
      });
    }
  }

  render() {
    const prayersRequests = this.state.prayersRequests.length > 0 ? this.state.prayersRequests[0] : [''];
    const prayersRequestsList = prayersRequests.map((response, index) => {
      return <PrayerRequestCard
        prayer_request={ response }
        currentUserEmail={ this.state.currentUserEmail }
        navigation={ this.state.navigation }
        numberOfLines={7}
        key={index}
        needLink={true} />;
    });

    return (

      <View style={ this.state.profileFeed ? styles.container_prayer_request_card : styles.container_prayer_request_card_with_margin }>
        { this.state.prayersRequests.length > 0 ?
          <ScrollView refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh}
            />}
          >
            { prayersRequestsList }
          </ScrollView>
          :
          <ActivityIndicator size="large" style = {styles.loader} />
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  loader: {
    color: "#0000ff",
    flex: 1,
    alignItems: 'center',
    position: 'absolute',
    top: 200,
    left: 150,
  },
  container_prayer_request_card_with_margin: {
    paddingBottom: '6%',
    backgroundColor: '#eaeaea',
  },
  container_prayer_request_card: {
    backgroundColor: '#eaeaea',
    height: '100%',
  },
});

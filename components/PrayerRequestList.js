import React from 'react'
import { ScrollView, StyleSheet, View, Image, ActivityIndicator, RefreshControl } from 'react-native'
import { getAllPrayersRequests, getUserPrayersRequests } from '../api/PrayerRequest'
import PrayerRequestCard from './PrayerRequestCard'

export default class PrayerRequestList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      prayersRequests: [],
      loaded: false,
      navigation: this.props.navigation,
      currentUserEmail: this.props.currentUserEmail,
      refreshing: false,
      profileFeed: this.props.profileFeed
    };
  }

  componentDidMount() {
    this.retrievePrayersRequests();
  }

  _onRefresh = () => {
   this.setState({refreshing: true});
   this.setState({prayersRequests: []});
   this.retrievePrayersRequests();
   this.setState({refreshing: false});
 }

 retrievePrayersRequests() {
   if (this.state.profileFeed) {
     getUserPrayersRequests(this.state.currentUserEmail).then(data => {
       this.state.prayersRequests.push(data.user_prayers_requests)
       this.setState({ loaded: true })
     })
   } else {
     getAllPrayersRequests().then(data => {
       this.state.prayersRequests.push(data.prayers_requests)
       this.setState({ loaded: true })
     })
   }
 }

  render() {
    var prayersRequests = this.state.prayersRequests.length > 0 ? this.state.prayersRequests[0] : ['']
    let prayersRequestsList = prayersRequests.map((response, index) => {
      return <PrayerRequestCard prayer_request={ response } currentUserEmail={ this.state.currentUserEmail } navigation={ this.state.navigation } numberOfLines={7} key={index} style={styles.ok} needLink={true} />
    });

    return (
      <View style={styles.container_prayer_request_card}>
        { this.state.prayersRequests.length > 0  ?
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
    color:"#0000ff",
    flex: 1,
    alignItems: 'center',
    position: 'absolute',
    top: 200,
    left: 150
  },
  container_prayer_request_card: {
    paddingBottom: '9%'
  },
  ok: {
    width: '100%'
  },
  container: {
     flexDirection: 'column',
     justifyContent: 'center',
     alignItems: 'center',
     backgroundColor: 'white',
     height: 600
  },
  coucou: {
    backgroundColor: 'green'
  }
});

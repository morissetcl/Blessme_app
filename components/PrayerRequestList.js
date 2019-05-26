import React from 'react'
import { ScrollView, StyleSheet, View, Image, ActivityIndicator } from 'react-native'
import { getAllPrayersRequests } from '../api/PrayerRequest'
import PrayerRequestCard from './PrayerRequestCard'

export default class PrayerRequestList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      prayersRequests: [],
      loaded: false,
      navigation: this.props.navigation,
      currentUserEmail: this.props.currentUserEmail
    };
  }

  componentDidMount() {
    getAllPrayersRequests().then(data => {
      this.state.prayersRequests.push(data.prayers_requests)
      this.setState({ loaded: true })
    })
  }

  render() {
    var prayersRequests = this.state.prayersRequests.length > 0 ? this.state.prayersRequests[0] : ['']
    let prayersRequestsList = prayersRequests.map((response, index) => {
      return <PrayerRequestCard prayer_request={ response } currentUserEmail={ this.state.currentUserEmail } navigation={ this.state.navigation } numberOfLines={7} key={index} style={styles.ok} needLink={true} />
    });

    return (
      <View style={styles.container_prayer_request_card}>
        { this.state.prayersRequests.length > 0  ?
          <ScrollView>
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

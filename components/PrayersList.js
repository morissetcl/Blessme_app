import React from 'react'
import { ScrollView, StyleSheet, View, Image, ActivityIndicator, RefreshControl, Text, TouchableOpacity } from 'react-native'
import { NavigationEvents } from 'react-navigation';

export default class PrayersList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      prayers: [],
      loaded: false,
      navigation: this.props.navigation,
      currentUserEmail: this.props.currentUserEmail,
      refreshing: false,
      profileFeed: this.props.profileFeed,
      prayersList: [],
      requestApi: this.props.requestApi
    };
  }

  componentDidMount() {
    this.retrieveAllPrayers();
  }

  goToPrayerRequest(prayerId) {
    this.state.navigation.navigate('Prayer', { prayerId: prayerId, currentUserEmail: this.state.currentUserEmail })
  }

  retrieveAllPrayers() {
    this.state.requestApi.then(data => {
      this.state.prayers.push(data.comments)
      var prayers = this.state.prayers.length > 0 ? this.state.prayers[0] : ['']
      this.setState({ prayersList:
        prayers.map((response, index) => {
          return <View style={styles.comment_card} key={index} id={index}>
                   <Text
                    style={styles.username}
                    >{response.user.username}</Text>
                   <TouchableOpacity>
                    <Text onPress={(value) => { this.goToPrayerRequest(response.prayer_request.id) }}>{response.body}</Text>
                   </TouchableOpacity>
                 </View>
        })
      })
    });
  }

  render() {
    return (
      <View style={ this.state.profileFeed ? styles.container_prayer_request_card : styles.container_prayer_request_card_with_margin }>
        <NavigationEvents onDidFocus={payload => this.retrieveAllPrayers()} />
        { this.state.prayers.length > 0  ?
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
    backgroundColor: '#eaeaea'
  },
  container_prayer_request_card_with_margin: {
    paddingBottom: '6%'
  },
  add_prayer: {
    borderRadius: 30,
    backgroundColor: '#ff8b6a',
    padding: 15
  },
  bottom_buttons: {
    backgroundColor: '#fafafa',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    position: 'absolute',
    bottom:0,
    left:0,
    width: '100%',
    height: '7%',
    alignItems: 'center',
    elevation: 1
  },
  container: {
    height: '8%',
    flex: 1,
  },
  content: {
    flex: 1,
    backgroundColor: '#eaeaea'
  },
  comment_card: {
    padding: '2%',
    backgroundColor: 'white',
    marginBottom: 10,
    marginTop: 10
  },
  username: {
    fontWeight: 'bold',
    color: '#63686e',
    marginBottom: '2%'
  },
  body: {
    color: '#7d7d7d',
    paddingLeft: '2%'
  },
  loader: {
    color:"#0000ff",
    flex: 1,
    alignItems: 'center',
    position: 'absolute',
    top: 200,
    left: 150
  }
})

import React from 'react';
import { ScrollView, StyleSheet, View, ActivityIndicator, RefreshControl, Dimensions } from 'react-native';
import PrayerRequestCard from './PrayerRequestCard';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { getPrayerRequests } from '../api/PrayerRequest';
import { loadPrayersRequests, getUserPrayersRequests } from '../store/actions/actionCreators'
import { NavigationEvents } from 'react-navigation';

class PrayerRequestList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      displayDeleteAction: this.props.displayDeleteAction,
      navigation: this.props.navigation,
      currentUserToken: this.props.currentUserToken,
      refreshing: false,
      profileFeed: this.props.profileFeed,
      userToken: this.props.userToken,
      loaded: false,
      pr: [],
    };
  }

  componentDidMount() {
    this.retrievePrayersRequests();
  }

  _onRefresh = () => {
    this.setState({ loaded: false });
    this.retrievePrayersRequests();
  }

  checkTokenToSearch() {
    if (this.state.userToken !== undefined) {
      return this.state.userToken;
    };
    return this.state.currentUserToken;
  }

  retrievePrayersRequests() {
    getPrayerRequests().then(prayerRequests => {
      this.setState({ pr: prayerRequests.prayers_requests });
      this.props.dispatch(
        loadPrayersRequests(prayerRequests.prayers_requests)
      );
    })
    this.setState({ loaded: true });
  }

  selectData() {
    if (this.state.profileFeed) {
      return this.props.allPrayersRequests.filter(pr => pr.user.token === this.checkTokenToSearch())
    }
    return this.props.allPrayersRequests;
  }

  render() {
    if (this.state.loaded) {
      const prayerRequests = this.selectData() ? this.selectData() : [];
      const prayersRequestsList = prayerRequests.map((response, index) => {
        const {title, body, user, id, category} = response
        return <PrayerRequestCard
          title={title}
          body={body}
          user={user}
          username={user.username}
          avatarUrl={user.avatar}
          prayerId={id}
          userToken={response.user.token}
          categoryLabel={category}
          categoryColor={category.color}
          createdAt={response.created_at}
          writingsCount={response.writings_count}
          audiosCount={response.audios_count}
          currentUserToken={ this.state.currentUserToken }
          navigation={ this.state.navigation }
          numberOfLines={7}
          key={Math.random()}
          displayDeleteAction={ this.state.displayDeleteAction }
          needLink={true}
        />;
      });

      return (
        <View style={ this.state.profileFeed ? styles.container_prayer_request_card : styles.card_with_margin }>
        <ScrollView refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh}
          />}
        >
          { prayersRequestsList }
        </ScrollView>
        </View>
      );
    } else {
      return (
        <ActivityIndicator size="large" style = {styles.loader} />
      );
    }
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
  card_with_margin: {
    paddingBottom: Dimensions.get('window').height / 11,
    backgroundColor: '#eaeaea',
    height: hp('84%'),
  },
  container_prayer_request_card: {
    backgroundColor: '#eaeaea',
    height: '100%',
  },
});

const mapDispatchToProps = dispatch => ({
   dispatch
});

const mapStateToProps = (state, ownProps) => {
  return {
    allPrayersRequests: state.prayerRequestReducer.data
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PrayerRequestList)

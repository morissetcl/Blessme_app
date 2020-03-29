import React from 'react';
import { ScrollView, StyleSheet, View, ActivityIndicator, RefreshControl } from 'react-native';
import { NavigationEvents } from 'react-navigation';
import PrayerRequestCard from './PrayerRequestCard';
import {bindActionCreators} from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../store/actions/PrayerRequest';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

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
      pr: []
    };
  }

  componentDidMount() {
    this.retrievePrayersRequests();
    this.setState({ pr: this.props.data.prayers_requests });
  }

  componentDidUpdate() {
    const prAdded = ((this.state.pr !== this.props.data.prayers_requests) && !this.state.loaded)
    if (prAdded){
      this.setState({ loaded: true });
    }
  }

  _onRefresh = () => {
    this.setState({ loaded: false });
    this.retrievePrayersRequests()
  }

  checkTokenToSearch() {
    if (this.state.userToken !== undefined) {
      return this.state.userToken;
    } else {
      return this.state.currentUserToken;
    }
  }

  retrievePrayersRequests() {
    if (this.state.profileFeed) {
      this.setState({ loaded: true });
      this.props.getUserPrayersRequests(this.checkTokenToSearch());
    } else {
      this.props.getAllPrayersRequests();
    }
  }

  render() {
    if (this.state.loaded) {
      const selectData = this.state.profileFeed ? this.props.userData.user_prayers_requests : this.props.data.prayers_requests
      const prayerRequests = selectData ? selectData : [];
      const prayersRequestsList = prayerRequests.map((response, index) => {
        return <PrayerRequestCard
          title={response.title}
          body={response.body}
          user={response.user}
          username={response.user.username}
          avatarUrl={response.user.avatar}
          prayerId={response.id}
          userToken={response.user.token}
          categoryLabel={response.category.label}
          categoryColor={response.category.color}
          createdAt={response.created_at}
          writingsCount={response.writings_count}
          audiosCount={response.audios_count}
          prayerId={response.id}
          currentUserToken={ this.state.currentUserToken }
          navigation={ this.state.navigation }
          numberOfLines={7}
          key={response.title}
          displayDeleteAction={ this.state.displayDeleteAction }
          needLink={true}
          />;
      });

      return (
        <View style={ this.state.profileFeed ? styles.container_prayer_request_card : styles.container_prayer_request_card_with_margin }>
          <NavigationEvents onDidFocus={ payload => this._onRefresh() } />
          { this.state.loaded ?
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
    } else {
      return (
        <ActivityIndicator size="large" style = {styles.loader} />
      )
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
  container_prayer_request_card_with_margin: {
    paddingBottom: '6%',
    backgroundColor: '#eaeaea',
    height: hp('84%')
  },
  container_prayer_request_card: {
    backgroundColor: '#eaeaea',
    height: '100%',
  },
});

function mapStateToProps(state) {
  return {
    loading: state.prayerRequest.dataReducer.loading,
    data: state.prayerRequest.dataReducer.data,
    userData: state.prayerRequest.dataReducer.userData
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(PrayerRequestList);

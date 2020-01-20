import React from 'react';
import { ScrollView, StyleSheet, View, ActivityIndicator, RefreshControl } from 'react-native';
import PrayerRequestCard from './PrayerRequestCard';
import {bindActionCreators} from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../store/actions/PrayerRequest';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

class PrayerRequestList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      navigation: this.props.navigation,
      currentUserEmail: this.props.currentUserEmail,
      refreshing: false,
      profileFeed: this.props.profileFeed,
      userEmail: this.props.userEmail,
      loaded: false,
      pr: []
    };
  }

  componentDidMount() {
    this.retrievePrayersRequests();
    this.setState({ pr: this.props.data.prayers_requests });
  }

  componentDidUpdate() {
    if ((this.state.pr !== this.props.data.prayers_requests) && !this.state.loaded){
      this.setState({ loaded: true });
    }
  }

  _onRefresh = () => {
    this.setState({ loaded: false });
    this.retrievePrayersRequests()
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
      this.setState({ loaded: true });
      this.props.getUserPrayersRequests(this.checkEmailToSearch());
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
          prayer_request={ response }
          currentUserEmail={ this.state.currentUserEmail }
          navigation={ this.state.navigation }
          numberOfLines={7}
          key={response.title}
          display_modal_action={true}
          needLink={true} />;
      });

      return (
        <View style={ this.state.profileFeed ? styles.container_prayer_request_card : styles.container_prayer_request_card_with_margin }>
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
    loading: state.dataReducer.loading,
    data: state.dataReducer.data,
    userData: state.dataReducer.userData
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(PrayerRequestList);

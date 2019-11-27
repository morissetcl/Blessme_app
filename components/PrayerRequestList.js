import React from 'react';
import { ScrollView, StyleSheet, View, ActivityIndicator, RefreshControl } from 'react-native';
import { getAllPrayersRequests, getUserPrayersRequests } from '../api/PrayerRequest';
import PrayerRequestCard from './PrayerRequestCard';
import {bindActionCreators} from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../store/actions';

class PrayerRequestList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
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
    this.props.getAllPrayersRequests();
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
      this.props.getUserPrayersRequests(this.checkEmailToSearch());
    } else {
      this.props.getAllPrayersRequests();
    }
  }

  render() {
    const selectData = this.state.profileFeed ? this.props.userData.user_prayers_requests : this.props.data.prayers_requests
    const prayerRequests = selectData ? selectData : [];
    const prayersRequestsList = prayerRequests.map((response, index) => {
      return <PrayerRequestCard
        prayer_request={ response }
        currentUserEmail={ this.state.currentUserEmail }
        navigation={ this.state.navigation }
        numberOfLines={7}
        key={index}
        display_modal_action={true}
        needLink={true} />;
    });

    return (

      <View style={ this.state.profileFeed ? styles.container_prayer_request_card : styles.container_prayer_request_card_with_margin }>
        { !this.props.data.loading ?
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

function mapStateToProps(state, props) {
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

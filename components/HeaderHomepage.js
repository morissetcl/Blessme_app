import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Header, Avatar, SearchBar, Button } from 'react-native-elements';
import { getUsers } from '../api/User';
import { getAllPrayersRequests, getUserPrayersRequests } from '../api/PrayerRequest';
import {bindActionCreators} from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../store/actions/PrayerRequest';
import * as firebase from "firebase";

class HeaderHomepage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      navigation: props.navigation,
      currentUserEmail: this.props.currentUserEmail,
      username: this.props.username,
      avatarUrl: '',
      search: ''
    };
  }

  componentDidMount() {
    getUsers(this.state.currentUserEmail).then(data => {
      this.setState({ avatarUrl: data.avatar });
    });
  }

  openProfile(prayerId) {
    this.state.navigation.navigate('Profile', { currentUserEmail: this.state.currentUserEmail,
      username: this.state.username });
  }

  updateSearch(e) {
    this.setState({
      search: e
    }, () => {
      this.props.getAllPrayersRequests(this.state.search);
    });
  }

  searchBar() {
    return (
      <SearchBar
        inputStyle={styles.inputStyle}
        containerStyle={styles.containerStyle}
        inputContainerStyle={styles.inputContainerStyle}
        placeholder={'Votre recherche...'}
        round={true}
        placeholderTextColor={styles.placeholderTextColor}
        onChangeText={this.updateSearch.bind(this)}
        value={this.state.search}
      />
    )
  }

  render() {
    return (
      <View style={styles.container}>
        <Header
          containerStyle={styles.header}
          placement="left"
          centerComponent={this.searchBar()}
          leftComponent={
            this.state.avatarUrl ?
              <Avatar rounded source={{ uri: this.state.avatarUrl }} onPress={(value) => { this.openProfile(); }} />
              :
              <Avatar rounded title='?' onPress={(value) => { this.openProfile(); }} />
          }
        />
      </View>
    );
  }
}


const styles = StyleSheet.create({
  header: {
    backgroundColor: '#49beb7',
  },
  container: {
    height: '8%',
  },
  inputStyle: {
    height: '80%',
    backgroundColor: 'white',
    color: 'red',
    fontSize: 12
  },
  containerStyle: {
    paddingTop: '4%',
    height: '100%',
    backgroundColor: '#49beb7',
    width: '100%',
    borderBottomWidth: 0,
    borderTopWidth: 0
  },
  inputContainerStyle: {
    height: '80%',
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 15
  }
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

export default connect(mapStateToProps, mapDispatchToProps)(HeaderHomepage);

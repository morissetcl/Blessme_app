import React, { Component } from 'react';
import { StyleSheet, View, Text, ActivityIndicator, TouchableOpacity, Alert, Dimensions } from 'react-native';

export default class Answer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      body: props.answer.body,
      user: props.answer.user
    };
  }

  commentFromOriginalPoster() {
    return (this.props.currentUser === this.state.user.token);
  }

  render() {
    return (
      <View
        style={styles.commentCard}
        key={this.props.created_at}
        id={this.props.index}
      >
        <TouchableOpacity>
          <Text
          style={[this.commentFromOriginalPoster() ? styles.usernameOp : styles.username]}
          >{this.state.user.username}
          </Text>
          <Text style={styles.prayerBody}>{ this.state.body }</Text>
        </TouchableOpacity>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eaeaea',
  },
  loader: {
    color: "#0000ff",
    flex: 1,
    alignItems: 'center',
    position: 'absolute',
    top: Dimensions.get('window').height / 2,
    left: Dimensions.get('window').width / 2,
  },
  prayerList: {
    paddingTop: 20,
    paddingBottom: Dimensions.get('window').height / 12,
  },
  commentCard: {
    borderLeftWidth: 1,
    borderLeftColor: '#63686e',
    marginLeft: '5%',
    paddingLeft: '2%',
    marginBottom: '2%',
    backgroundColor: 'white',
    flex: 1,
  },
  commentCardOp: {
    borderLeftWidth: 2,
    borderLeftColor: '#ff8b6a',
    marginLeft: '5%',
    paddingLeft: '2%',
    marginBottom: '2%',
    backgroundColor: 'white',
    flex: 1,
  },
  username: {
    fontWeight: 'bold',
    color: '#63686e',
    marginBottom: '2%',
  },
  usernameOp: {
    fontWeight: 'bold',
    color: '#ff8b6a',
    marginBottom: '2%',
  },
  publishButton: {
    position: 'absolute',
    right: 30,
    top: '4%',
    color: '#207dff',
  },
  deleteButton: {
    position: 'absolute',
    right: 0,
    top: '4%',
  },
  actionsButton: {
    position: 'relative',
    bottom: 27,
    right: 5,
  },
  playerAudio: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
    marginLeft: '5%',
    marginRight: '5%',
    width: '90%',
  },
  createdAt: {
    position: 'absolute',
    top: 8,
    right: 12,
    fontSize: 12,
    color: '#bbbbbb',
  },
  prayerBody: {
    marginTop: 5,
  },
});

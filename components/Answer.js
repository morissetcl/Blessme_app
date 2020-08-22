import React, { Component } from 'react';
import { StyleSheet, View, Text, ActivityIndicator, TouchableOpacity, Alert, Dimensions } from 'react-native';
import ModalActions from './ModalActions';

export default class Answer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      createdAt: props.answer.created_at,
      body: props.answer.body,
      user: props.answer.user
    };
  }

  commentFromOriginalPoster() {
    return (this.props.currentUser === this.state.user.token);
  }

  render() {
    const formattedDate = new Date(Date.parse(this.state.createdAt) * 1000);
    const unformattedCreatedDateSince = Date.now() - Date.parse(this.state.createdAt);
    const createdAtSince = Math.floor(unformattedCreatedDateSince/8.64e7);
    const trad = `il y a ${createdAtSince} jours`
    const formattedCreatedAtSince = (createdAtSince !== 0) ? trad : "Aujourd'hui";

    return (
      <View
        style={styles.commentCard}
        key={this.props.created_at}
        id={this.props.index}
      >
        <Text
        style={[this.commentFromOriginalPoster() ? styles.usernameOp : styles.username]}
        >{this.state.user.username}
        </Text>
        <Text style = {styles.createdAt}>{ formattedCreatedAtSince }</Text>
        <ModalActions
          navigation={this.props.navigation}
          body={this.state.body}
          username={this.state.user.username}
          answer={this.props.answer}
          actionType={'signalAnswer'}
          newPrayer={false}
        />
        <Text style={styles.prayerBody}>{ this.state.body }</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eaeaea',
  },
  commentCard: {
    borderLeftWidth: 1,
    borderLeftColor: '#bbbbbb',
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
  prayerBody: {
    marginTop: 5,
  },
  createdAt: {
    position: 'absolute',
    top: 8,
    right: 40,
    fontSize: 12,
    color: '#bbbbbb',
  }
});

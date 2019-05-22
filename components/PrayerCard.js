import React from 'react'
import { StyleSheet, View, Text, Image, Animated, TouchableOpacity, ActivityIndicator, ImageBackground } from 'react-native'
import { Divider, Avatar, Card, ListItem, Button, Icon } from 'react-native-elements'

export default class PrayerCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      prayer: this.props.prayer
    }
  }

  render() {
    return (
      <View style={styles.comment_card}>
        <Text style={styles.username}>{this.state.prayer.user.email}</Text>
        <Text style={styles.body}>{this.state.prayer.body}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  comment_card: {
    padding: '2%',
    marginBottom: '5%',
    backgroundColor: 'white'
  },
  username: {
    fontWeight: 'bold',
    color: '#63686e',
    marginBottom: '2%'
  },
  body: {
    color: '#7d7d7d',
    paddingLeft: '2%'
  }
})

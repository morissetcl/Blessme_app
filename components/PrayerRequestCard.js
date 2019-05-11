import React from 'react'
import { StyleSheet, View, Text, Image, Animated, TouchableOpacity, ActivityIndicator, ImageBackground } from 'react-native'
import { Card, ListItem, Button, Icon } from 'react-native-elements'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faPenSquare } from '@fortawesome/free-solid-svg-icons'

export default class PrayerRequestCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: props.prayer_request['title'],
      body: props.prayer_request['body'],
      user: props.prayer_request['user']
    }
  }
  render() {
    return (
      <Card title={this.state.body}>
        <Text>{this.state.title}</Text>
        <Button
          icon={<FontAwesomeIcon icon={ faPenSquare } size={28} color={ '#ffff' } />}
          backgroundColor='#03A9F4'
          buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0}}
          title='VIEW NOW' />
      </Card>
    );
  }
}

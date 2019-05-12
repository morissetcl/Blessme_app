import React from 'react'
import { StyleSheet, View, Text, Image, Animated, TouchableOpacity, ActivityIndicator, ImageBackground } from 'react-native'
import { Divider, Avatar, Card, ListItem, Button, Icon } from 'react-native-elements'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faPenSquare, faComment, faMicrophone } from '@fortawesome/free-solid-svg-icons'

export default class PrayerRequestCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: props.prayer_request['title'],
      body: props.prayer_request['body'],
      user: props.prayer_request['user'],
      prayerId: props.prayer_request['id'],
      navigation: this.props.navigation
    }
  }

  goToPrayer(prayerId) {
    this.state.navigation.navigate('Prayer', { prayerId: prayerId })
  }

  render() {
    return (
      <Card title={<Avatar rounded title="MD" />}>
        <Text style = {styles.created_at}>2 days ago</Text>
        <Text style = {styles.card_title}> {this.state.title}</Text>

        <Text numberOfLines={7} style = {styles.card_body}>{this.state.body}</Text>
        <View style = {styles.card_actions}>
          <TouchableOpacity  onPress={(value) => { this.goToPrayer(this.state.prayerId) }}>
            <FontAwesomeIcon icon={ faPenSquare } size={24} color={ '#FFFFFF' } style = {styles.button}/>
          </TouchableOpacity>
          <TouchableOpacity>
            <FontAwesomeIcon icon={ faMicrophone } size={24} color={ '#FFFFFF' } style = {styles.button}/>
          </TouchableOpacity>
        </View>
      </Card>
    );
  }
}

const styles = StyleSheet.create({
  card_body: {
    flex: 1
  },
  card_title: {
    textAlign: 'center',
    marginBottom: 10,
    fontWeight: 'bold'
  },
  created_at: {
    position:'relative',
    top: -25,
    left: 45
  },
  button: {
    padding: 10
  },
  card_actions: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    position: 'relative',
    top: 10,
    paddingTop: 5,
    paddingBottom: 5,
    backgroundColor: '#ff8b6a',
    borderRadius: 30
  }
});

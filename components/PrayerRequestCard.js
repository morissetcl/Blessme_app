import React from 'react'
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native'
import { Avatar, Card } from 'react-native-elements'
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
      navigation: this.props.navigation,
      numberOfLines: this.props.numberOfLines,
      needLink: this.props.needLink,
      currentUserEmail: this.props.currentUserEmail
    }
  }

  goToPrayer(prayerId) {
    if (this.state.needLink) {
      this.state.navigation.navigate('Prayer', { prayerId: prayerId, currentUserEmail: this.state.currentUserEmail })
    }
  }

  render() {
    return (
      <TouchableOpacity activeOpacity={0.7} onPress={(value) => { this.goToPrayer(this.state.prayerId) }}>
        <Card title={<Avatar rounded title="MD" />}>
          <Text style = {styles.created_at}>2 days ago</Text>
          <Text style = {styles.card_title}> {this.state.title}</Text>
          <Text numberOfLines={this.state.numberOfLines}>{this.state.body}</Text>
          <View style = {styles.card_actions}>
            <TouchableOpacity onPress={(value) => { this.goToPrayer(this.state.prayerId) }}>
              <FontAwesomeIcon icon={ faPenSquare } size={24} color={ '#FFFFFF' } style = {styles.button}/>
            </TouchableOpacity>
            <TouchableOpacity>
              <FontAwesomeIcon icon={ faMicrophone } size={24} color={ '#FFFFFF' } style = {styles.button}/>
            </TouchableOpacity>
          </View>
        </Card>
      </TouchableOpacity>
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

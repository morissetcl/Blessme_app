import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Avatar, Card } from 'react-native-elements';
import  ModalActions  from './ModalActions';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPenSquare, faComment, faMicrophone } from '@fortawesome/free-solid-svg-icons';
import { getPrayers } from '../api/Prayer';
import { NavigationEvents } from 'react-navigation';

export default class PrayerRequestCard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      title: props.prayer_request['title'],
      body: props.prayer_request['body'],
      user: props.prayer_request['user'],
      username: props.prayer_request['user']['username'],
      avatarUrl: props.prayer_request['user']['avatar'],
      prayerId: props.prayer_request['id'],
      navigation: this.props.navigation,
      createdAt: props.prayer_request['created_at'],
      numberOfLines: this.props.numberOfLines,
      needLink: this.props.needLink,
      currentUserEmail: this.props.currentUserEmail,
      numberOfPrayer: '-',
      numberOfAudioPrayer: '-',
      userEmail: props.prayer_request['user']['email']
    };
  }

  componentDidMount() {
    this.commentCounter(this.state.prayerId);
  }

  goToPrayer(prayerId) {
    if (this.state.needLink) {
      this.state.navigation.navigate('Prayer', { prayerId: prayerId, currentUserEmail: this.state.currentUserEmail });
    }
  }

  goToProfile(username) {
    this.state.navigation.navigate('Profile', { username: username, userEmail: this.state.userEmail, currentUserEmail: this.state.currentUserEmail });
  }

  commentCounter(prayerId) {
    getPrayers(prayerId).then(data => {
      this.setState({ numberOfWritingPrayer: data.prayer_request_comments.map(a => a.body).filter(Boolean).length });
      this.setState({ numberOfAudioPrayer: data.prayer_request_comments.map(a => a.audio).filter(Boolean).length });
    });
  }

  render() {
    const avatar = this.state.avatarUrl ? this.state.avatarUrl : '';
    const formattedDate = new Date(Date.parse(this.state.createdAt) * 1000);
    const unformattedCreatedDateSince = Date.now() - Date.parse(this.state.createdAt);
    const createdAtSince = Math.floor(unformattedCreatedDateSince/8.64e7);
    const formattedCreatedAtSince = (createdAtSince !== 0) ? `Il y a ${createdAtSince} jours` : "Aujourd'hui";

    return (
      <TouchableOpacity activeOpacity={0.7}
        onPress={(value) => { this.goToPrayer(this.state.prayerId); }}
        style = {styles.space_between_card}>
        <NavigationEvents onDidFocus={ payload => this.commentCounter(this.state.prayerId) } />
        <Card title={<Avatar rounded source={{ uri: avatar }}
          onPress={() => { this.goToProfile(this.state.username); }} />}>
          <Text style = {styles.username} > {this.state.username}</Text>
          <Text style = {styles.created_at}>{ formattedCreatedAtSince }</Text>

          {(this.state.userEmail === this.state.currentUserEmail) ?
            <ModalActions prayerRequestId={ this.state.prayerId } navigation={ this.state.navigation }/>
            :
            <Text></Text>
          }

          <Text style = {styles.card_title}> {this.state.title}</Text>
          <Text style = {styles.body_request} numberOfLines={this.state.numberOfLines}>{this.state.body}</Text>

          <View style = {styles.card_actions}>
            <TouchableOpacity onPress={(value) => { this.goToPrayer(this.state.prayerId); }}>
              <View style = {styles.comment_action_card_contenair}>
                <FontAwesomeIcon icon={ faComment } size={24} color={ '#FFFFFF' } style = {styles.button}/>
                <Text style = {styles.number_of_comment}>{ this.state.numberOfWritingPrayer }</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity>
              <View style = {styles.comment_action_card_contenair}>
                <FontAwesomeIcon icon={ faMicrophone } size={24} color={ '#FFFFFF' } style = {styles.button}/>
                <Text style = {styles.number_of_comment}>{ this.state.numberOfAudioPrayer }</Text>
              </View>
            </TouchableOpacity>
          </View>
        </Card>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  space_between_card: {
    marginBottom: 10,
    marginTop: -10,
  },
  number_of_comment: {
    marginLeft: 10,
    color: 'white',
    fontWeight: 'bold',
  },
  comment_action_card_contenair: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card_body: {
    flex: 1,
  },
  username: {
    position: 'absolute',
    top: 8,
    left: 40,
    fontWeight: 'bold',
    color: '#bbbbbb',
  },
  card_title: {
    textAlign: 'center',
    marginBottom: 10,
    fontWeight: 'bold',
    color: '#63686e',
  },
  created_at: {
    position: 'absolute',
    top: 8,
    right: 30,
    fontSize: 12,
    color: '#bbbbbb',
  },
  button: {
    padding: 10,
  },
  body_request: {
    marginTop: 20,
    marginBottom: 20,
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
    borderRadius: 30,
  },
});

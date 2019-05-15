import React, { Component } from 'react';
import { TouchableHighlight, Modal, StyleSheet, View, Text, Button, TouchableOpacity, ActivityIndicator } from 'react-native'
import { getPrayerRequest } from '../api/PrayerRequest'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faPenSquare, faHeart, faMicrophone } from '@fortawesome/free-solid-svg-icons'
import PrayerRequestCard from './PrayerRequestCard'
import WritingCommentForm from './form/WritingCommentForm'

export default class Prayer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      prayerId: props.navigation.state.params.prayerId,
      loaded: false,
      prayerRequest: [],
      navigation: props.navigation,
      currentUserEmail: props.navigation.state.params.currentUserEmail
    }
  }

  componentDidMount() {
    getPrayerRequest(this.state.prayerId).then(data => {
      this.setState({ prayerRequest: data })
      this.setState({ loaded: true })
    })
  }

  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  render() {
    return (
      <View style={styles.container}>
      { this.state.loaded ?
        <View style={styles.prayer_card} >
          <PrayerRequestCard prayer_request={ this.state.prayerRequest } numberOfLines={1000} />
        </View>

        :
        <ActivityIndicator size="large" style = {styles.loader} />
      }
      { this.state.loaded ?
        <View style = {styles.bottom_buttons}>
          <TouchableOpacity>
            <FontAwesomeIcon icon={ faHeart } size={28} color={ '#49beb7' } />
          </TouchableOpacity>
          <TouchableOpacity>
            <FontAwesomeIcon
              icon={ faPenSquare }
              size={28} color={ '#49beb7' }
              style = {styles.add_prayer}
              onPress={(value) => {
                this.state.navigation.navigate('WritingCommentForm', { prayerRequest: this.state.prayerRequest, currentUserEmail: this.state.currentUserEmail })
              }}
             />
          </TouchableOpacity>
          <TouchableOpacity>
            <FontAwesomeIcon icon={ faMicrophone } size={28} color={ '#49beb7' } />
          </TouchableOpacity>
        </View>
        :
        <ActivityIndicator size="large" style = {styles.loader} />
      }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF' // background tab color
  },
  loader: {
    color:"#0000ff",
    flex: 1,
    alignItems: 'center',
    position: 'absolute',
    top: 200,
    left: 150
  },
  prayer_card: {
    paddingTop: 20
  },
  bottom_buttons: {
    backgroundColor: '#fafafa',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    position: 'absolute',
    bottom:0,
    left:0,
    width: '100%',
    height: '10%',
    alignItems: 'center',
    elevation: 1
  }
})

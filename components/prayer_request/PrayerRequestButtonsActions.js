import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faHeart, faMicrophone, faPenSquare } from '@fortawesome/free-solid-svg-icons';
import { ScrollView, StyleSheet, View, Text, Button, TouchableOpacity, ActivityIndicator } from 'react-native';

export default class PrayerRequestButtonsActions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      prayerId: props.prayerId,
      currentUserEmail: props.currentUserEmail,
      prayerRequest: props.prayerRequest,
      navigation: props.navigation,
    };
  }

  render() {
    return (
      <View style = {styles.bottom_buttons}>
        <TouchableOpacity>
          <FontAwesomeIcon icon={ faHeart } size={34} color={ '#49beb7' } />
        </TouchableOpacity>
        <TouchableOpacity>
          <FontAwesomeIcon
            icon={ faPenSquare }
            size={34} color={ '#49beb7' }
            style = {styles.add_prayer}
            onPress={(value) => {
              this.state.navigation.navigate('WritingCommentForm', { prayerRequest: this.state.prayerRequest,
                currentUserEmail: this.state.currentUserEmail,
                prayerId: this.state.prayerId });
            }}
          />
        </TouchableOpacity>
        <TouchableOpacity>
          <FontAwesomeIcon
            icon={ faMicrophone }
            size={34}
            color={ '#49beb7' }
            onPress={(value) => {
              this.state.navigation.navigate('AudioRecorder', { prayerId: this.state.prayerId,
                currentUserEmail: this.state.currentUserEmail });
            }}
          />
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  bottom_buttons: {
    backgroundColor: '#fafafa',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    height: '10%',
    alignItems: 'center',
    elevation: 1,
  },
});

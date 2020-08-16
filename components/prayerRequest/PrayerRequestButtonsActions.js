import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faMicrophone, faPenSquare } from '@fortawesome/free-solid-svg-icons';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

export default function PrayerRequestButtonsActions(props) {
  return (
    <View style = {styles.bottom_buttons}>
      <TouchableOpacity>
        <FontAwesomeIcon
          icon={ faPenSquare }
          size={34} color={ '#49beb7' }
          style = {styles.add_prayer}
          onPress={(value) => {
            props.navigation.navigate('WritingComment', {
              prayerRequest: props.prayerRequest,
              currentUserToken: props.currentUserToken,
              prayerId: props.prayerId });
          }}
        />
      </TouchableOpacity>
      <TouchableOpacity>
        <FontAwesomeIcon
          icon={ faMicrophone }
          size={34}
          color={ '#49beb7' }
          onPress={(value) => {
            props.navigation.navigate('AudioRecorder', {
              prayerId: props.prayerId
            });
          }}
        />
      </TouchableOpacity>
    </View>
  )
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
    height: hp('8%'),
    alignItems: 'center',
    elevation: 1,
  },
});

import React, { Component } from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
  BackHandler
} from 'react-native';
import { Asset, Font } from 'expo';
import { Audio } from 'expo-av';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPlay, faStop } from '@fortawesome/free-solid-svg-icons';
import { styles } from './Styles'

export default class Prayer extends Component {
  constructor(props) {
    super(props);
    this.playbackInstance = null;
    this.state = {
      playbackInstancePosition: null,
      playbackInstanceDuration: null,
      shouldPlay: false,
      isPlaying: false,
      isBuffering: false,
      isLoading: true,
      volume: 1.0,
      audio: this.props.audio,
      duration: this.props.duration,
    };
  }

  componentDidMount() {
    Audio.setAudioModeAsync({
      staysActiveInBackground: true,
      allowsRecordingIOS: true,
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
      playThroughEarpieceAndroid: false,
      volume: 1.0
    });

    this._loadNewPlaybackInstance(false);
    BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPressAndroid);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPressAndroid);
  }

  onBackButtonPressAndroid = () => {
    if (!this.playbackInstance) return;

    this.playbackInstance.stopAsync();
  };

  async _loadNewPlaybackInstance(playing) {
    if (this.playbackInstance !== null) {
      await this.playbackInstance.unloadAsync();
      this.playbackInstance.setOnPlaybackStatusUpdate(null);
      this.playbackInstance = null;
    }

    const source = { uri: this.state.audio };
    const initialStatus = {
      shouldPlay: playing,
      volume: this.state.volume,
    };

    const { sound, status } = await Audio.Sound.createAsync(
      source,
      initialStatus,
      this._onPlaybackStatusUpdate,
    );
    this.playbackInstance = sound;
  }

  _onPlaybackStatusUpdate = status => {
    if (status.isLoaded) {
      this.setState({
        playbackInstancePosition: status.positionMillis,
        playbackInstanceDuration: status.durationMillis,
        shouldPlay: status.shouldPlay,
        isPlaying: status.isPlaying,
        isBuffering: status.isBuffering,
        rate: status.rate,
        volume: 1.0,
      });
      if (status.didJustFinish) {
        this.playbackInstance.stopAsync();
      }
    } else {
      if (status.error) {
        console.log(`FATAL PLAYER ERROR: ${status.error}`);
      }
    }
  };

  async _updatePlaybackInstanceForIndex(playing) {
    await this._loadNewPlaybackInstance(playing);
  }

  _onPlayPausePressed = () => {
    if (this.playbackInstance !== null) {
      if (this.state.isPlaying) {
        this.playbackInstance.pauseAsync();
      } else {
        this.playbackInstance.playAsync();
      }
    }
  };

   _onStopPressed = () => {
     if (this.playbackInstance !== null) {
       this.playbackInstance.stopAsync();
     }
   };

   _getMMSSFromMillis(millis) {
     const totalSeconds = millis / 1000;
     const seconds = Math.floor(totalSeconds % 60);
     const minutes = Math.floor(totalSeconds / 60);

     const padWithZero = number => {
       const string = number.toString();
       if (number < 10) {
         return '0' + string;
       }
       return string;
     };
     return padWithZero(minutes) + ':' + padWithZero(seconds);
   }

   _getTimestamp() {
     return `${this._getMMSSFromMillis(
       this.state.playbackInstancePosition,
     )} / ${this._getMMSSFromMillis(
       this.state.playbackInstanceDuration,
     )}`;
   }

   render() {
     return <View style={styles.container}>
       <View style={styles.coucou}>
         {this.state.isPlaying ? (
           <FontAwesomeIcon
             icon={faPlay}
             size={24}
             color={ '#ffb8a3' }
           />
         ) : (
           <TouchableOpacity
             style={styles.wrapper}
             onPress={this._onPlayPausePressed}
           >
             <FontAwesomeIcon
               icon={faPlay}
               size={24}
               color={ '#49beb7' }
             />
           </TouchableOpacity>
         )}

         <TouchableOpacity
           underlayColor={'#ffb8a3'}
           style={styles.wrapper}
           onPress={this._onStopPressed}
         >
           <FontAwesomeIcon
             icon={faStop}
             size={24}
             color={ '#49beb7' }
           />
         </TouchableOpacity>
         <Text style={styles.text}>
           {this._getTimestamp()}
         </Text>
       </View>
     </View>;
   }
}

import React from 'react';
import { Dimensions, Slider, StyleSheet, Text, TouchableHighlight, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import Expo, { Asset, Font } from 'expo';
import * as FileSystem from 'expo-file-system'
import { Audio } from 'expo-av';
import * as Permissions from 'expo-permissions';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPenSquare, faHeart, faMicrophone,
  faPause, faPlay, faStop, faRedoAlt } from '@fortawesome/free-solid-svg-icons';
import { createPrayer, editPrayer } from '../../api/Prayer';
import Pulse from 'react-native-pulse';

const BACKGROUND_COLOR = '#eaeaea';
const DISABLED_OPACITY = 0.5;

export default class AudioRecorder extends React.Component {
  constructor(props) {
    super(props);
    this.recording = null;
    this.sound = null;
    this.isSeeking = false;
    this.shouldPlayAtEndOfSeek = false;
    this.state = {
      prayerId: props.navigation.state.params.prayerId,
      currentUserEmail: props.navigation.state.params.currentUserEmail,
      fontLoaded: true,
      haveRecordingPermissions: false,
      isLoading: false,
      isPlaybackAllowed: false,
      muted: false,
      soundPosition: null,
      soundDuration: null,
      recordingDuration: null,
      shouldPlay: false,
      isPlaying: false,
      isRecording: false,
      shouldCorrectPitch: true,
      volume: 1.0,
      rate: 1.0,
      playThroughEarpieceAndroid: true,
      audioBase64: '',
      loading: false,
    };
    this.recordingSettings = JSON.parse(JSON.stringify({
      ...Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY,
      ios: {
        ...Audio.RECORDING_OPTIONS_PRESET_LOW_QUALITY.ios,
        extension: '.amr_wb',
        outputFormat: Audio.RECORDING_OPTION_IOS_OUTPUT_FORMAT_AMR_WB,
      },
    }));
  }

  componentDidMount() {
    Audio.setIsEnabledAsync(true);
    this._askForPermissions();
  }

  _askForPermissions = async () => {
    const response = await Permissions.askAsync(Permissions.AUDIO_RECORDING);
    this.setState({
      haveRecordingPermissions: response.status === 'granted',
    });
  };

  _updateScreenForSoundStatus = status => {
    if (status.isLoaded) {
      this.setState({
        soundDuration: status.durationMillis,
        soundPosition: status.positionMillis,
        shouldPlay: status.shouldPlay,
        isPlaying: status.isPlaying,
        rate: status.rate,
        muted: status.isMuted,
        volume: status.volume,
        shouldCorrectPitch: status.shouldCorrectPitch,
        isPlaybackAllowed: true
      });
    } else {
      this.setState({
        soundDuration: null,
        soundPosition: null,
        isPlaybackAllowed: false,
      });
      if (status.error) {
        console.log(`FATAL PLAYER ERROR: ${status.error}`);
      }
    }
  };

  _updateScreenForRecordingStatus = status => {
    if (status.canRecord) {
      this.setState({
        isRecording: status.isRecording,
        recordingDuration: status.durationMillis,
      });
    } else if (status.isDoneRecording) {
      this.setState({
        isRecording: false,
        recordingDuration: status.durationMillis,
      });
      if (!this.state.isLoading) {
        this._stopRecordingAndEnablePlayback();
      }
    }
  };

  async _stopPlaybackAndBeginRecording() {
    this.setState({
      isLoading: true,
    });
    if (this.sound !== null) {
      await this.sound.unloadAsync();
      this.sound.setOnPlaybackStatusUpdate(null);
      this.sound = null;
    }
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
      playThroughEarpieceAndroid: true,
      staysActiveInBackground: true
    });
    if (this.recording !== null) {
      this.recording.setOnRecordingStatusUpdate(null);
      this.recording = null;
    }

    const recording = new Audio.Recording();
    await recording.prepareToRecordAsync(this.recordingSettings);
    recording.setOnRecordingStatusUpdate(this._updateScreenForRecordingStatus);

    this.recording = recording;
    await this.recording.startAsync(); // Will call this._updateScreenForRecordingStatus to update the screen.
    this.setState({
      isLoading: false,
    });
  }

  addPrayer() {
    this.setState({ loading: true });
    createPrayer({ currentUserEmail: this.state.currentUserEmail,
      soundDuration: this.state.soundDuration,
      audioUri: this.state.audioBase64,
      prayerId: this.state.prayerId,
      navigation: this.props.navigation,
    });
  }

  async _stopRecordingAndEnablePlayback() {
    this.setState({
      isLoading: true,
    });
    try {
      await this.recording.stopAndUnloadAsync();
    } catch (error) {
      // Do nothing -- we are already unloaded.
    }
    const info = await FileSystem.getInfoAsync(this.recording.getURI());
    console.log(`FILE INFO: ${JSON.stringify(info)}`);
    const fileBase64 = await FileSystem.readAsStringAsync(
      this.recording.getURI(),
      {
        encoding: FileSystem.EncodingType.Base64,
      });
    this.setState({ audioBase64: fileBase64 });
    await Audio.setAudioModeAsync({
      staysActiveInBackground: true,
      allowsRecordingIOS: false,
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
      playsInSilentModeIOS: true,
      playsInSilentLockedModeIOS: true,
      shouldDuckAndroid: true,
      interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
      playThroughEarpieceAndroid: true,
    });
    const { sound, status } = await this.recording.createNewLoadedSoundAsync(
      {
        isLooping: true,
        isMuted: this.state.muted,
        volume: this.state.volume,
        rate: this.state.rate,
        shouldCorrectPitch: this.state.shouldCorrectPitch,
      },
      this._updateScreenForSoundStatus,
    );
    this.sound = sound;
    this.setState({
      isLoading: false,
    });
  }

  _onRecordPressed = () => {
    if (this.state.isRecording) {
      this._stopRecordingAndEnablePlayback();
    } else {
      this._stopPlaybackAndBeginRecording();
    }
  };

  _onPlayPausePressed = () => {
    if (this.sound !== null) {
      if (this.state.isPlaying) {
        this.sound.pauseAsync();
      } else {
        this.sound.playAsync();
      }
    }
  };

  _onStopPressed = () => {
    if (this.sound !== null) {
      this.sound.stopAsync();
    }
  };

  _trySetRate = async (rate, shouldCorrectPitch) => {
    if (this.sound !== null) {
      try {
        await this.sound.setRateAsync(rate, shouldCorrectPitch);
      } catch (error) {
      }
    }
  };

  _onSeekSliderValueChange = value => {
    if (this.sound !== null && !this.isSeeking) {
      this.isSeeking = true;
      this.shouldPlayAtEndOfSeek = this.state.shouldPlay;
      this.sound.pauseAsync();
    }
  };

  _onSeekSliderSlidingComplete = async value => {
    if (this.sound !== null) {
      this.isSeeking = false;
      const seekPosition = value * this.state.soundDuration;
      if (this.shouldPlayAtEndOfSeek) {
        this.sound.playFromPositionAsync(seekPosition);
      } else {
        await this.sound.setPositionAsync(seekPosition);
      }
    }
  };

  _getSeekSliderPosition() {
    if (
      this.sound !== null &&
      this.state.soundPosition !== null &&
      this.state.soundDuration !== null
    ) {
      return this.state.soundPosition / this.state.soundDuration;
    }
    return 0;
  }

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

  _getPlaybackTimestamp() {
    if (
      this.sound !== null &&
      this.state.soundPosition !== null &&
      this.state.soundDuration !== null
    ) {
      return `${this._getMMSSFromMillis(this.state.soundPosition)} / ${this._getMMSSFromMillis(
        this.state.soundDuration,
      )}`;
    }
    return '';
  }

  _getRecordingTimestamp() {
    if (this.state.recordingDuration !== null) {
      return `${this._getMMSSFromMillis(this.state.recordingDuration)}`;
    }
    return `${this._getMMSSFromMillis(0)}`;
  }

  render() {
    return !this.state.haveRecordingPermissions ?
      <View style={styles.container}>
        <View />
        <Text style={styles.noPermissionsText}>
          Vous devez activer les autorisations audio pour enregistrer votre prière.
        </Text>
        <View />
      </View>
      :
      this.state.loading ?
        <ActivityIndicator size="large" style = {styles.loader} />
        :
        <View style={styles.container}>
          <View style={styles.recordingContainer}>
            <TouchableOpacity
              style={styles.roundedIcon}
              onPress={this._onRecordPressed}
              disabled={this.state.isLoading}>
              <FontAwesomeIcon icon={ this.state.isRecording ? faStop : faMicrophone }
                size={34} color={ '#FFFFFF' }
                style={styles.iconMicro}/>
            </TouchableOpacity>
            <View style={styles.timer}>
              <Text style={styles.recordingTimestamp}>
                {this._getRecordingTimestamp()}
              </Text>
            </View>
            <View/>
          </View>
          <View
            style={[
              styles.halfScreenContainer,
              {
                opacity:
                  !this.state.isPlaybackAllowed || this.state.isLoading ? DISABLED_OPACITY : 1.0,
              },
            ]}>
            <View />

            <View style={styles.playbackContainer}>
              <Slider
                style={styles.playbackSlider}
                value={this._getSeekSliderPosition()}
                onValueChange={this._onSeekSliderValueChange}
                onSlidingComplete={this._onSeekSliderSlidingComplete}
                disabled={!this.state.isPlaybackAllowed || this.state.isLoading}
              />
              <Text style={styles.playbackTimestamp}>
                {this._getPlaybackTimestamp()}
              </Text>
            </View>

            <View style={[styles.buttonsContainerBase, styles.buttonsContainerTopRow]}>
              { this.state.isPlaybackAllowed ?
                <View style={styles.playStopContainer}>
                  <TouchableHighlight
                    underlayColor={BACKGROUND_COLOR}
                    style={styles.wrapper}
                    onPress={this._onPlayPausePressed}
                    disabled={!this.state.isPlaybackAllowed || this.state.isLoading}>
                    <FontAwesomeIcon icon={ this.state.isPlaying ? faPause : faPlay } size={34} color={ '#49beb7' } />
                  </TouchableHighlight>
                  <TouchableHighlight

                    underlayColor={BACKGROUND_COLOR}
                    style={styles.wrapper}
                    onPress={() => { this.setState({ isPlaybackAllowed: false,
                      recordingDuration: null,
                      soundDuration: null }); } }
                    disabled={!this.state.isPlaybackAllowed || this.state.isLoading}>

                    <FontAwesomeIcon icon={ faRedoAlt } size={34} color={ '#49beb7' } />
                  </TouchableHighlight>
                  <TouchableOpacity

                    style={styles.publish_button}
                    onPress={() => { this.addPrayer(); } }
                    disabled={!this.state.isPlaybackAllowed || this.state.isLoading}>
                    <Text style={styles.button_text}>Publier</Text>
                  </TouchableOpacity>

                </View>
                :
                <View></View>
              }
              <View />
              <View style={styles.actionButtons}>
                { this.state.isRecording ?
                  <View>
                    <Pulse
                      color='orange'
                      numPulses={3}
                      diameter={this.state.isRecording ? 400 : 0}
                      speed={20}
                      duration={2000}
                      onPress={this._onRecordPressed}
                      disabled={this.state.isLoading}
                    />
                  </View>
                  :
                  <Text></Text>
                }
              </View>
            </View>
            <View />
          </View>
        </View>;
  }
}

const styles = StyleSheet.create({
  actionButtons: {
    position: 'absolute',
    bottom: 260,
    left: '53%',
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'stretch',
    backgroundColor: BACKGROUND_COLOR,
    minHeight: 300,
    maxHeight: '100%',
    paddingTop: '20%',
    paddingBottom: '20%',
  },
  timer: {
    paddingLeft: 50,
    paddingRight: 50,
  },
  noPermissionsText: {
    textAlign: 'center',
  },
  wrapper: {},
  halfScreenContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'stretch',
    minHeight: 300 / 2.0,
    maxHeight: 300 / 2.0,
  },
  recordingContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  playbackContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'stretch',
    minHeight: 20 * 2.0,
    maxHeight: 20 * 2.0,
  },
  roundedIcon: {
    borderRadius: 100,
    backgroundColor: '#ff8b6a',
    padding: 60,
  },
  playbackSlider: {
    alignSelf: 'stretch',
  },
  recordingTimestamp: {
    position: 'relative',
    left: 10,
    top: 20,
  },
  playbackTimestamp: {
    textAlign: 'right',
    alignSelf: 'stretch',
    paddingRight: 20,
  },
  iconMicro: {
    position: 'relative',
    left: 0,
  },
  buttonsContainerBase: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  buttonsContainerTopRow: {
    maxHeight: 20,
    alignSelf: 'stretch',
    paddingRight: 20,
  },
  playStopContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingLeft: 30,
    paddingRight: 30,
  },
  publish_button: {
    color: '#207dff',
    fontWeight: 'bold',
    borderColor: '#207dff',
    borderBottomWidth: 2,
  },
  button_text: {
    color: '#207dff',
  },
});

import { StyleSheet } from 'react-native'

const BACKGROUND_COLOR = '#eaeaea';

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
});

export { styles }

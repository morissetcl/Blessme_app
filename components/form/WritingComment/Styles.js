import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  divider: {
    backgroundColor: '#dee0d9',
    width: '90%',
    height: 1,
    marginLeft: '5%',
    position: 'relative',
    top: 30,
  },
  prayerTitle: {
    textAlign: 'justify',
    paddingRight: '30%',
    paddingLeft: 10,
    paddingTop: 20,
    fontWeight: 'bold',
  },
  commentInput: {
    marginTop: 50,
    marginLeft: 10,
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  positionPublishButton: {
    position: 'absolute',
    right: '10%',
    top: 25,
  },
});

export { styles }

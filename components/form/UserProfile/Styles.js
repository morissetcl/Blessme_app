import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  signout_button: {
    position: 'absolute',
    left: '10%',
    bottom: '4%',
    color: '#207dff',
    fontWeight: 'bold',
    borderColor: '#207dff',
    borderBottomWidth: 2,
  },
  input: {
    padding: 5,
    marginTop: 10,
    marginLeft: '5%',
    marginRight: '5%',
    backgroundColor: '#f5f5f5',
  },
  title_input: {
    marginTop: 10,
    marginLeft: '5%',
    marginRight: '5%',
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: 30,
  },
  positionPublishButton: {
    position: 'absolute',
    right: '10%',
    top: '4%',
  },
});

export { styles }

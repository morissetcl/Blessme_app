import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boutons_wrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginLeft: '5%',
    marginTop: 15,
  },
  form_wrapper: {
    backgroundColor: 'white',
    paddingLeft: '5%',
    paddingRight: '10%',
    paddingBottom: '5%',
    margin: '12%',
    borderRadius: 10,
    paddingTop: 50
  },
  bouton: {
    borderColor: 'transparent',
    backgroundColor: '#ff8b6a',
    width: '80%',
    padding: 10,
    display: 'flex',
    alignItems: 'center',
    marginBottom: '5%',
    borderRadius: 30,
    borderWidth: 2,
  }
});

export { styles }

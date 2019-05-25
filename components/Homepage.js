import React from 'react'
import { StyleSheet, View } from 'react-native'
import Connexion from './Connexion'

export default class Homepage extends React.Component {
  render() {
    return (
      <View>
        <Connexion style = {styles.coucou} navigation={this.props.navigation}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
     flexDirection: 'column',
     justifyContent: 'center',
     alignItems: 'center',
     backgroundColor: 'white',
     height: 600
  },
  coucou: {
    backgroundColor: 'green'
  }
});

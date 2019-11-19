import React from 'react';
import { View } from 'react-native';
import Connexion from './Connexion';

export default class Homepage extends React.Component {
  render() {
    return (
      <View>
        <Connexion navigation={this.props.navigation}/>
      </View>
    );
  }
}

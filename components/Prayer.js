import React, { Component } from 'react';
import { StyleSheet, View, Text, Button, TouchableOpacity} from 'react-native'

export default class Prayer extends Component {
  static navigationOptions = { header: null };

  constructor(props) {
    super(props);
    this.state = {
      prayerId: this.props.prayerId
    }
    console.log(this.state.prayerId)
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>je suis une prière</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF' // background tab color
  }
})

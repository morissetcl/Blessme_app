import React, { Component } from 'react';
import { StyleSheet, View, Text, Button, TouchableOpacity} from 'react-native'
import Tabs from '../Tabs'

export default class Prayers extends Component {
  static navigationOptions = { header: null };

  constructor(props) {
    super(props);
    this.state = { loading: true };
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.container}>
          <Tabs>
            <View title="PRIERE" style={styles.content}>
            </View>
            <View title="INTERCESSION" style={styles.content}>
            </View>
          </Tabs>
        </View>
        <View style = {styles.bottom_buttons}>
          <TouchableOpacity>
            <Text>coucou</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text>coucou</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  bottom_buttons: {
    backgroundColor: '#01676b',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    position: 'absolute',
    bottom:0,
    left:0,
    width: '100%',
    height: '10 %',
    alignItems: 'center'
  },
  container: {
    flex: 1,                            // Take up all screen
    backgroundColor: 'red'
  },
  content: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: '20%'
  }
})

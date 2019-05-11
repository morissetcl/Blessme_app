import React, { Component } from 'react';
import { StyleSheet, View, Text, Button, TouchableOpacity} from 'react-native'
import PrayerRequestList from './PrayerRequestList'
import Tabs from '../Tabs'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faPenSquare } from '@fortawesome/free-solid-svg-icons'

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
              <PrayerRequestList/>
            </View>
            <View title="INTERCESSION" style={styles.content}>
            </View>
          </Tabs>
        </View>
        <View style = {styles.bottom_buttons}>
          <TouchableOpacity>
            <FontAwesomeIcon icon={ faPenSquare } size={28} color={ '#ffff' } />
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
    backgroundColor: 'white'
  }
})

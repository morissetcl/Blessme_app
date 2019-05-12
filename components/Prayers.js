import React, { Component } from 'react';
import { StyleSheet, View, Text, Button, TouchableOpacity} from 'react-native'
import PrayerRequestList from './PrayerRequestList'
import Tabs from '../Tabs'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faPenSquare, faPlusCircle } from '@fortawesome/free-solid-svg-icons'

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
              <PrayerRequestList navigation={this.props.navigation}/>
            </View>
            <View title="INTERCESSION" style={styles.content}>
            </View>
          </Tabs>
        </View>
        <View style = {styles.bottom_buttons}>
          <TouchableOpacity>
            <FontAwesomeIcon icon={ faPenSquare } size={28} color={ '#49beb7' } />
          </TouchableOpacity>
          <TouchableOpacity>
            <FontAwesomeIcon icon={ faPlusCircle } size={36} color={ '#FFFFFF' } style = {styles.add_prayer} />
          </TouchableOpacity>
          <TouchableOpacity>
            <FontAwesomeIcon icon={ faPenSquare } size={28} color={ '#49beb7' } />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  add_prayer: {
    borderRadius: 30,
    backgroundColor: '#ff8b6a',
    padding: 15
  },
  bottom_buttons: {
    backgroundColor: '#fafafa',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    position: 'absolute',
    bottom:0,
    left:0,
    width: '100%',
    height: '10%',
    alignItems: 'center',
    elevation: 1
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF' // background tab color
  },
  content: {
    flex: 1,
    backgroundColor: '#eaeaea'
  }
})

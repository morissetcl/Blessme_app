import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity} from 'react-native'
import PrayerRequestList from './PrayerRequestList'
import HeaderHomepage from './HeaderHomepage'
import Tabs from '../Tabs'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faPenSquare, faPlusCircle } from '@fortawesome/free-solid-svg-icons'
import { createUser } from '../api/User'

export default class Prayers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true ,
      navigation: this.props.navigation,
      currentUserEmail: this.props.currentUserEmail,
      username: this.props.username
    };
  }

  componentWillMount() {
    createUser({ currentUserEmail: this.state.currentUserEmail, username: this.state.username })
  }

  render() {
    return (
      <View style={styles.container}>
        <HeaderHomepage navigation={this.state.navigation} currentUserEmail={ this.state.currentUserEmail } username={ this.state.username }/>
        <View style={styles.container}>
          <Tabs>
            <View title="PRIERE" style={styles.content}>
              <PrayerRequestList navigation={this.state.navigation} currentUserEmail={ this.state.currentUserEmail } username={ this.state.username } profileFeed={ false }/>
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
            <FontAwesomeIcon
              icon={ faPlusCircle }
              size={36} color={ '#FFFFFF' }
              style = {styles.add_prayer}
              onPress={(value) => {
                this.state.navigation.navigate('PrayerRequestForm', { currentUserEmail: this.state.currentUserEmail })
              }}
             />
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
    height: '8%',
    flex: 1,
  },
  content: {
    flex: 1,
    backgroundColor: '#eaeaea'
  }
})

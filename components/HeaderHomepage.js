import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity} from 'react-native'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { Header, Avatar, Input, SearchBar } from 'react-native-elements'
import { faUser } from '@fortawesome/free-solid-svg-icons'

export default class HeaderHomepage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      navigation: props.navigation,
      currentUserEmail: this.props.currentUserEmail,
      username: this.props.username,
      search: ''
    };
  }

  openProfile(prayerId) {
    this.state.navigation.navigate('Profile', { currentUserEmail: this.state.currentUserEmail, username: this.state.username })
  }

  render() {
    return (
      <View style={styles.container}>
      <Header
        containerStyle={styles.header}
        placement="left"
        leftComponent={
          <Avatar rounded title="MD"
            onPress={(value) => { this.openProfile() }}
          />
        }
        // centerComponent={<SearchBar
        //                   platform='android'
        //                   inputStyle={{ backgroundColor: '#fafafa', height: 20 , width: '100%', borderRadius: 5}}
        //                   containerStyle={{ height: 20, borderRadius: 5 }}
        //                   inputContainerStyle={{ backgroundColor: '#fafafa', position:'relative', bottom: 18 , borderRadius: 5}}
        //                   placeholder="Type Here..."
        //                   onChangeText={this.updateSearch}
        //                   value={this.state.search}
        //                 />}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#49beb7'
  },
  container: {
    height: '8%',
    backgroundColor: 'red' // background tab color
  },
  content: {
    position: 'absolute',
    top: 40,
    left: 20,
    backgroundColor: 'red',
    width: '10%',
    textAlign: 'center',
    paddingLeft: 3
  }
})

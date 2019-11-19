import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { Header, Avatar} from 'react-native-elements';
import { getUsers } from '../api/User';

export default class HeaderHomepage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      navigation: props.navigation,
      currentUserEmail: this.props.currentUserEmail,
      username: this.props.username,
      avatarUrl: '',
    };
  }

  componentDidMount() {
    getUsers(this.state.currentUserEmail).then(data => {
      this.setState({ avatarUrl: data.avatar });
    });
  }

  openProfile(prayerId) {
    this.state.navigation.navigate('Profile', { currentUserEmail: this.state.currentUserEmail,
      username: this.state.username });
  }

  render() {
    return (
      <View style={styles.container}>
        <Header
          containerStyle={styles.header}
          placement="left"
          leftComponent={
            this.state.avatarUrl ?
              <Avatar rounded source={{ uri: this.state.avatarUrl }} onPress={(value) => { this.openProfile(); }} />
              :
              <Avatar rounded title='?' onPress={(value) => { this.openProfile(); }} />
          }
        />
      </View>
    );
  }
}


const styles = StyleSheet.create({
  header: {
    backgroundColor: '#49beb7',
  },
  container: {
    height: '8%',
    backgroundColor: 'red',
  }
});

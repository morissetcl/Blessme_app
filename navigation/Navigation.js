// Navigation/Navigation.js
import { createStackNavigator, createAppContainer } from 'react-navigation'
import Homepage from '../components/Homepage'
import Connexion from '../components/Connexion'
import Prayers from '../components/Prayers'
import Prayer from '../components/Prayer'

const SearchStackNavigator = createStackNavigator(
  {
    Homepage: {
      screen: Homepage,
      navigationOptions: {
        header: null
      },
    },
    Connexion: {
      screen: Connexion,
      navigationOptions: {
        header: null
      },
    },
    Prayer: {
      screen: Prayer,
      navigationOptions: {
        title: '',
        headerTintColor: '#FFFFFF',
        headerStyle: {
          backgroundColor: '#49beb7'
        }
      },
    },
    Prayers: {
      screen: Prayers,
      navigationOptions: {
        header: null
      },
    },
  },
  {
    headerTintColor: 'red',
    initialRouteName: 'Prayers'
  }
)

export default createAppContainer(SearchStackNavigator)

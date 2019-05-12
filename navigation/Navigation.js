// Navigation/Navigation.js
import { createStackNavigator, createAppContainer } from 'react-navigation'
import Homepage from '../components/Homepage'
import Connexion from '../components/Connexion'
import Prayers from '../components/Prayers'
import Prayer from '../components/Prayer'

const SearchStackNavigator = createStackNavigator(
  {
    Homepage: {
      screen: Homepage
    },
    Connexion: {
      screen: Connexion,
      navigationOptions: {
        title: 'Connexion'
      },
    },
    Prayer: {
      screen: Prayer,
      navigationOptions: {
        title: 'Prayer'
      },
    },
    Prayers: {
      screen: Prayers,
      navigationOptions: {
        title: 'Prayers'
      },
    },
  },
  {
    headerTintColor: 'red',
    initialRouteName: 'Prayers'
  }
)

export default createAppContainer(SearchStackNavigator)

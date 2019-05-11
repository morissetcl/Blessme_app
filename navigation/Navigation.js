// Navigation/Navigation.js
import { createStackNavigator, createAppContainer } from 'react-navigation'
import Homepage from '../components/Homepage'
import Connexion from '../components/Connexion'
import Prayers from '../components/Prayers'

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
    Prayers: {
      screen: Prayers,
      navigationOptions: {
        title: 'Prayers'
      },
    },
  },
  {
    headerTintColor: 'red',
    initialRouteName: 'Homepage'
  }
)

export default createAppContainer(SearchStackNavigator)

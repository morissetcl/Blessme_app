// Navigation/Navigation.js
import { createStackNavigator, createAppContainer } from 'react-navigation'
import Homepage from '../components/Homepage'
import Connexion from '../components/Connexion'
import Prayers from '../components/Prayers'
import Prayer from '../components/Prayer'
import WritingCommentForm from '../components/form/WritingCommentForm'

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
    WritingCommentForm: {
      screen: WritingCommentForm,
      navigationOptions: {
        title: 'Prière',
        headerTintColor: '#FFFFFF',
        headerStyle: {
          backgroundColor: '#49beb7'
        }
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

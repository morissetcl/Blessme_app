// Navigation/Navigation.js
import { createStackNavigator, createAppContainer } from 'react-navigation';
import Homepage from '../components/Homepage';
import Connexion from '../components/Connexion';
import Prayers from '../components/Prayers';
import Prayer from '../components/Prayer';
import WritingCommentForm from '../components/form/WritingCommentForm';
import UserProfileForm from '../components/form/UserProfileForm';
import PrayerRequestForm from '../components/form/PrayerRequestForm';
import Profile from '../components/Profile';
import AudioRecorder from '../components/form/AudioRecorder';
import ResetPassword from '../components/form/ResetPassword';

const SearchStackNavigator = createStackNavigator(
  {
    Homepage: {
      screen: Homepage,
      navigationOptions: {
        header: null,
      },
    },
    Connexion: {
      screen: Connexion,
      navigationOptions: {
        header: null,
      },
    },
    ResetPassword: {
      screen: ResetPassword,
      navigationOptions: {
        header: null,
      },
    },
    WritingCommentForm: {
      screen: WritingCommentForm,
      navigationOptions: {
        title: 'Prière',
        headerTintColor: '#FFFFFF',
        headerStyle: {
          backgroundColor: '#49beb7',
        },
      },
    },
    UserProfileForm: {
      screen: UserProfileForm,
      navigationOptions: {
        title: 'Modifier vos informations',
        headerTintColor: '#FFFFFF',
        headerStyle: {
          backgroundColor: '#49beb7',
        },
      },
    },
    PrayerRequestForm: {
      screen: PrayerRequestForm,
      navigationOptions: {
        title: 'Demande de prière',
        headerTintColor: '#FFFFFF',
        headerStyle: {
          backgroundColor: '#49beb7',
        },
      },
    },
    Prayer: {
      screen: Prayer,
      navigationOptions: {
        title: '',
        headerTintColor: '#FFFFFF',
        headerStyle: {
          backgroundColor: '#49beb7',
        },
      },
    },
    Prayers: {
      screen: Prayers,
      navigationOptions: {
        header: null,
      },
    },
    Profile: {
      screen: Profile,
      navigationOptions: {
        header: null,
      },
    },
    AudioRecorder: {
      screen: AudioRecorder,
      navigationOptions: {
        title: 'Prière audio',
        headerTintColor: '#FFFFFF',
        headerStyle: {
          backgroundColor: '#49beb7',
        },
      },
    },
  },
  {
    headerTintColor: 'red',
    initialRouteName: 'Connexion',
  },
);

export default createAppContainer(SearchStackNavigator);

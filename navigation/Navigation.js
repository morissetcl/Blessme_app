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
import AudioRecorderForm from '../components/form/AudioRecorderForm';
import ResetPassword from '../components/form/ResetPassword';
import * as Localization from 'expo-localization';
import i18n from 'i18n-js';

i18n.locale = Localization.locale;
i18n.fallbacks = true;

i18n.translations = {
  fr: {
    prayer: 'Prière',
    editProfil: 'Modifier vos informations',
    prayerRequest: 'Demande de prière',
    audio: 'Prière audio',
  },
  en: {
    prayer: 'Prayer',
    editProfil: 'Edit your informations',
    prayerRequest: 'Prayer request',
    audio: 'Prayer audio',
  },
};

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
        title: i18n.t('prayer'),
        headerTintColor: '#FFFFFF',
        headerStyle: {
          backgroundColor: '#49beb7',
        },
      },
    },
    UserProfileForm: {
      screen: UserProfileForm,
      navigationOptions: {
        title: i18n.t('editProfil'),
        headerTintColor: '#FFFFFF',
        headerStyle: {
          backgroundColor: '#49beb7',
        },
      },
    },
    PrayerRequestForm: {
      screen: PrayerRequestForm,
      navigationOptions: {
        title: i18n.t('prayerRequest'),
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
    AudioRecorderForm: {
      screen: AudioRecorderForm,
      navigationOptions: {
        title: i18n.t('audio'),
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

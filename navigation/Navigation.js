// Navigation/Navigation.js
import { createStackNavigator, createAppContainer } from 'react-navigation';
import Homepage from '../components/Homepage';
import Connexion from '../components/Connexion';
import Prayers from '../components/Prayers';
import Prayer from '../components/Prayer';
import WritingComment from '../components/form/WritingComment/WritingComment';
import UserProfile from '../components/form/UserProfile/UserProfile';
import PrayerRequest from '../components/form/PrayerRequest/PrayerRequest';
import Profile from '../components/Profile';
import AudioRecorder from '../components/form/AudioRecorder/AudioRecorder';
import ResetPassword from '../components/form/ResetPassword/ResetPassword';
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
    WritingComment: {
      screen: WritingComment,
      navigationOptions: {
        header: null,
      },
    },
    UserProfile: {
      screen: UserProfile,
      navigationOptions: {
        header: null,
      },
    },
    PrayerRequest: {
      screen: PrayerRequest,
      navigationOptions: {
        header: null,
      },
    },
    Prayer: {
      screen: Prayer,
      navigationOptions: {
        header: null,
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
        header: null,
      },
    },
  },
  {
    initialRouteName: 'Connexion',
  },
);

export default createAppContainer(SearchStackNavigator);

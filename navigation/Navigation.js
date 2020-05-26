// Navigation/Navigation.js
import { createStackNavigator, createAppContainer } from 'react-navigation';
import { fadeIn, fromLeft } from 'react-navigation-transitions';
import Homepage from '../components/Homepage';
import Connexion from '../components/Connexion';
import Prayers from '../components/Prayers';
import Prayer from '../components/prayers/writing/Prayer';
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

const handleCustomTransition = ({ scenes }) => {
  const prevScene = scenes[scenes.length - 2];
  const nextScene = scenes[scenes.length - 1];

  if (nextScene.route.routeName === 'Profile' &&
  prevScene.route.routeName !== 'Prayers') {
    return fromLeft(1000);
  };
  return fadeIn(500);
}

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
        headerLeft: null,
        title: i18n.t('prayer'),
        headerTintColor: '#FFFFFF',
        headerStyle: {
          backgroundColor: '#49beb7',
        },
      },
    },
    UserProfile: {
      screen: UserProfile,
      navigationOptions: {
        headerLeft: null,
        title: i18n.t('editProfil'),
        headerTintColor: '#FFFFFF',
        headerStyle: {
          backgroundColor: '#49beb7',
        },
      },
    },
    PrayerRequest: {
      screen: PrayerRequest,
      navigationOptions: {
        headerLeft: null,
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
        headerLeft: null,
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
        headerLeft: null,
        title: i18n.t('audio'),
        headerTintColor: '#FFFFFF',
        headerStyle: {
          backgroundColor: '#49beb7',
        },
      },
    },
  },
  {
    initialRouteName: 'Connexion',
    transitionConfig: (nav) => handleCustomTransition(nav)
  },
);

export default createAppContainer(SearchStackNavigator);

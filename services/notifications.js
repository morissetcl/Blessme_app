import { AsyncStorage } from 'react-native';
import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';
import { getApiUrl } from '../api/GetApiUrl';

const PUSH_ENDPOINT = getApiUrl() + "/expo_tokens";

let registerForNotifications;

export default registerForNotifications = async (token) => {
  const expoToken = await Notifications.getExpoPushTokenAsync();
  fetch(PUSH_ENDPOINT, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Accept-Encoding': 'gzip, deflate',
    },
    body: JSON.stringify({
      expo_token: expoToken,
      token: token,
    }),
  });
};

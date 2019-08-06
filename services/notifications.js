import { AsyncStorage } from 'react-native';
import { Permissions, Notifications } from 'expo';

const PUSH_ENDPOINT = "https://blessme-serveur.herokuapp.com/api/v1/expo_tokens";

let registerForNotifications;

export default registerForNotifications = async (email) => {
  const { status } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
  if (status !== 'granted') {
    const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    if (status !== 'granted') {
      return;
    }
  }

  const token = await Notifications.getExpoPushTokenAsync();

  fetch(PUSH_ENDPOINT, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Accept-Encoding': 'gzip, deflate',
    },
    body: JSON.stringify({
      token: token,
      email: email,
    }),
  });
};

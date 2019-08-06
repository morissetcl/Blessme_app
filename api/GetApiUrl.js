import Constants from 'expo-constants';

export function getApiUrl() {
  if (Constants.manifest.releaseChannel.indexOf('prod') !== -1) {
    return 'https://blessme-serveur-production.herokuapp.com/api/v1';
  } else if (Constants.manifest.releaseChannel.indexOf('staging') !== -1) {
    return 'https://blessme-serveur.herokuapp.com/api/v1';
  } else {
    return 'https://blessme-serveur-production.herokuapp.com/api/v1';
  }
}

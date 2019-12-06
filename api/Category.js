import Constants from 'expo-constants';
import { getApiUrl } from './GetApiUrl';

export function getCategories() {
  const url = `${getApiUrl()}/categories`;
  return fetch(url)
    .then((response) => response.json())
    .catch((error) => console.error(error));
}

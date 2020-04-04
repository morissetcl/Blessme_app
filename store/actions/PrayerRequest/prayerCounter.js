// not used yet //
import { getApiUrl } from '../../../api/GetApiUrl';

export const PRAYER_COUNTER = 'PRAYER_COUNTER';
//Import the sample data

export function prayerCounter(prayerId) {
  return (dispatch) => {
    const url = `${getApiUrl()}/prayers_requests/${prayerId}/comments`;
    return fetch(url)
      .then((response) => response.json())
      .then((data) => dispatch({ type: PRAYER_COUNTER,
        writingsCount: data.writings_count,
        audiosCount: data.audios_count,
      }))
      .catch((error) => console.error(error));
  };
}

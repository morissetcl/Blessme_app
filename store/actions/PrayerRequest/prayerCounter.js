// not used yet //
import { getApiUrl } from '../../../api/GetApiUrl';

export const PRAYER_COUNTER = 'PRAYER_COUNTER';
//Import the sample data

export function prayerCounter(prayerId){
    return (dispatch) => {
      const url = `${getApiUrl()}/prayers_requests/${prayerId}/comments`;
      return fetch(url)
        .then((response) => response.json())
        .then((data) => dispatch({type: PRAYER_COUNTER, numberOfWritingPrayer: writingCommentNumber(data), numberOfAudioPrayer: audioCommentNumber(data) }) )
        .catch((error) => console.error(error));
    };
}

function writingCommentNumber(data) {
  return data.prayer_request_comments.map(a => a.body).filter(Boolean).length
}

function audioCommentNumber(data) {
  return data.prayer_request_comments.map(a => a.audio).filter(Boolean).length
}

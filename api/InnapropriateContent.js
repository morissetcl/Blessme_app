import { getApiUrl } from './GetApiUrl';

export function createInnapropriateContent(params) {
  const alertableId = params['alertableId'];
  const object = params['object'];
  fetch(`${getApiUrl()}/innapropriate_contents`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      alertable_id: alertableId,
      object: object
    })
  });
}

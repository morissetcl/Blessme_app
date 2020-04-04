import { showMessage } from "react-native-flash-message";

export function displayMessage(message, type) {
  showMessage({
    message: message,
    type: type,
    icon: type,
  });
}

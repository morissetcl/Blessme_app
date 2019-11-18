import { showMessage } from "react-native-flash-message";

export function displayMessage(message, type, icon) {
  showMessage({
    message: message,
    type: type,
    icon: icon
  });
}

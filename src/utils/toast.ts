import Toast from 'react-native-toast-message';

export const errorToast = (message?: string) => {
  if (message) {
    Toast.show({
      type: 'error',
      text1: message,
    });
  }
};

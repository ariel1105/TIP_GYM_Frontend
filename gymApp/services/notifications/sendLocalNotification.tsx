import * as Notifications from 'expo-notifications';

export const sendLocalNotification = (title: string, body: string) => {
  Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      sound: true,
    },
    trigger: null,
  });
};
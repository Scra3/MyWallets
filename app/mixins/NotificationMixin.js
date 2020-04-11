import { LocalNotifications } from 'nativescript-local-notifications'

export const NotificationMixin = {
  methods: {
    async $_createNotification(body, thumbnail, title) {
      await LocalNotifications.schedule([
        {
          id: 1,
          title: title,
          body: body,
          bigTextStyle: false, // Allow more than 1 row of the 'body' text on Android, but setting this to true denies showing the 'image'
          thumbnail: thumbnail,
          forceShowWhenInForeground: true,
          at: new Date(new Date().getTime() + 1000),
          actions: [
            {
              id: 'yes',
              type: 'button',
              title: 'launch app',
              launch: true
            },
            {
              id: 'no',
              type: 'button',
              title: 'ok',
              launch: false
            }
          ]
        }
      ])
    }
  }
}

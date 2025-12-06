import notifee, { TimestampTrigger, TriggerType } from '@notifee/react-native';
import { ICalendarEvent } from '../types/event';

export const notificationService = {
  async requestPermission(): Promise<boolean> {
    try {
      console.log('[NOTIF] Requesting permission...');
      const settings = await notifee.requestPermission();
      console.log('[NOTIF] Permission settings:', JSON.stringify(settings));
      return settings.authorizationStatus >= 1;
    } catch (error) {
      console.error('[NOTIF] Error requesting permission:', error);
      return false;
    }
  },

  async createChannel() {
    await notifee.createChannel({
      id: 'events',
      name: 'Event Notifications',
      importance: 4,
      sound: 'default',
    });
  },

  async scheduleEventNotification(event: ICalendarEvent): Promise<string | null> {
    console.log('[NOTIF] Starting scheduleEventNotification for:', event.id, event.title);
    try {
      console.log('[NOTIF] Inside try block');

      const [hours, minutes] = event.time.split(':').map(Number);
      const eventDateTime = new Date(event.date);
      eventDateTime.setHours(hours, minutes, 0, 0);

      console.log('[NOTIF] Event date/time:', eventDateTime.toISOString());
      console.log('[NOTIF] Current time:', new Date().toISOString());
      console.log('[NOTIF] Time difference (ms):', eventDateTime.getTime() - Date.now());

      if (eventDateTime.getTime() <= Date.now()) {
        console.warn('[NOTIF] Event time is in the past');
        return null;
      }

      const trigger: TimestampTrigger = {
        type: TriggerType.TIMESTAMP,
        timestamp: eventDateTime.getTime(),
      };
      
      const notificationId = await notifee.createTriggerNotification(
        {
          id: `event-${event.id}`,
          title: event.title,
          body: `Your event starts now`,
          android: {
            channelId: 'events',
            pressAction: {
              id: 'default',
            },
            smallIcon: 'ic_launcher',
          },
          ios: {
            sound: 'default',
          },
        },
        trigger,
      );

      console.log('[NOTIF] Notification scheduled successfully:', notificationId);
      return notificationId;
    } catch (error) {
      console.error('Error scheduling notification:', error);
      return null;
    }
  },

  async cancelNotification(eventId: string) {
    try {
      await notifee.cancelNotification(`event-${eventId}`);
    } catch (error) {
      console.error('Error canceling notification:', error);
    }
  },

  async cancelAllNotifications() {
    try {
      await notifee.cancelAllNotifications();
    } catch (error) {
      console.error('Error canceling all notifications:', error);
    }
  },

  async getScheduledNotifications() {
    try {
      return await notifee.getTriggerNotifications();
    } catch (error) {
      console.error('Error getting scheduled notifications:', error);
      return [];
    }
  },
};

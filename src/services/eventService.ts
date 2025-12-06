import firestore from '@react-native-firebase/firestore';
import { ICalendarEvent, IEventFormData } from '../types/event';

const EVENTS_COLLECTION = 'events';

export const eventService = {
  async createEvent(
    userId: string,
    eventData: IEventFormData,
  ): Promise<string> {
    try {
      const eventRef = await firestore().collection(EVENTS_COLLECTION).add({
        userId,
        title: eventData.title,
        date: firestore.Timestamp.fromDate(eventData.date),
        time: eventData.time,
        notificationEnabled: eventData.notificationEnabled,
        createdAt: firestore.FieldValue.serverTimestamp(),
        updatedAt: firestore.FieldValue.serverTimestamp(),
      });
      return eventRef.id;
    } catch (error) {
      console.error('Error creating event:', error);
      throw error;
    }
  },

  async updateEvent(
    eventId: string,
    eventData: Partial<IEventFormData>,
  ): Promise<void> {
    try {
      const updateData: any = {
        ...eventData,
        updatedAt: firestore.FieldValue.serverTimestamp(),
      };

      if (eventData.date) {
        updateData.date = firestore.Timestamp.fromDate(eventData.date);
      }

      await firestore().collection(EVENTS_COLLECTION).doc(eventId).update(updateData);
    } catch (error) {
      console.error('Error updating event:', error);
      throw error;
    }
  },

  async deleteEvent(eventId: string): Promise<void> {
    try {
      await firestore().collection(EVENTS_COLLECTION).doc(eventId).delete();
    } catch (error) {
      console.error('Error deleting event:', error);
      throw error;
    }
  },

  getEventsForDate(userId: string, date: Date, callback: (events: ICalendarEvent[]) => void) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return firestore()
      .collection(EVENTS_COLLECTION)
      .where('userId', '==', userId)
      .where('date', '>=', firestore.Timestamp.fromDate(startOfDay))
      .where('date', '<=', firestore.Timestamp.fromDate(endOfDay))
      .orderBy('date', 'asc')
      .onSnapshot(
        snapshot => {
          const events: ICalendarEvent[] = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
              id: doc.id,
              userId: data.userId,
              title: data.title,
              date: data.date.toDate(),
              time: data.time,
              notificationEnabled: data.notificationEnabled,
              createdAt: data.createdAt?.toDate() || new Date(),
              updatedAt: data.updatedAt?.toDate() || new Date(),
            };
          });

          events.sort((a, b) => a.time.localeCompare(b.time));
          callback(events);
        },
        error => {
          console.error('Error fetching events:', error);
          callback([]);
        },
      );
  },

  getEventsForMonth(userId: string, year: number, month: number, callback: (events: ICalendarEvent[]) => void) {
    const startOfMonth = new Date(year, month, 1);
    const endOfMonth = new Date(year, month + 1, 0, 23, 59, 59, 999);

    return firestore()
      .collection(EVENTS_COLLECTION)
      .where('userId', '==', userId)
      .where('date', '>=', firestore.Timestamp.fromDate(startOfMonth))
      .where('date', '<=', firestore.Timestamp.fromDate(endOfMonth))
      .orderBy('date', 'asc')
      .onSnapshot(
        snapshot => {
          const events: ICalendarEvent[] = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
              id: doc.id,
              userId: data.userId,
              title: data.title,
              date: data.date.toDate(),
              time: data.time,
              notificationEnabled: data.notificationEnabled,
              createdAt: data.createdAt?.toDate() || new Date(),
              updatedAt: data.updatedAt?.toDate() || new Date(),
            };
          });
          callback(events);
        },
        error => {
          console.error('Error fetching events:', error);
          callback([]);
        },
      );
  },
};

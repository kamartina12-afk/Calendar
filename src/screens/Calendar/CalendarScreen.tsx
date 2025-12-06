import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomHeader from '../../components/Header/CustomHeader';
import { Calendar } from '../../components/Calendar/Calendar';
import { DayView } from '../../components/DayView/DayView';
import { EventModal } from '../../components/EventModal/EventModal';
import { EventList } from '../../components/EventList/EventList';
import { useCalendar } from '../../hooks/useCalendar';
import { useAuth } from '../../contexts/AuthContext';
import { eventService } from '../../services/eventService';
import { notificationService } from '../../services/notificationService';
import { ICalendarEvent, IEventFormData } from '../../types/event';
import { formatDate } from '../../utils/dateUtils';
import styles from './styles';
import { LABELS } from './labels/labels';

const CalendarScreen: React.FC = () => {
  const { user } = useAuth();
  const { selectedDate, viewMode, toggleViewMode, selectDate } = useCalendar();
  const [events, setEvents] = useState<ICalendarEvent[]>([]);
  const [selectedDateEvents, setSelectedDateEvents] = useState<
    ICalendarEvent[]
  >([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<ICalendarEvent | null>(
    null,
  );

  const handleDateSelect = (date: Date) => {
    selectDate(date);
  };

  useEffect(() => {
    if (!user?.uid) return;

    const unsubscribe = eventService.getEventsForMonth(
      user.uid,
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      loadedEvents => {
        setEvents(loadedEvents);
      },
    );

    return () => unsubscribe();
  }, [user, selectedDate]);

  useEffect(() => {
    if (!user?.uid) return;

    console.log('Loading events for date:', selectedDate.toDateString());
    const unsubscribe = eventService.getEventsForDate(
      user.uid,
      selectedDate,
      dayEvents => {
        console.log('Day events received:', dayEvents.length, dayEvents);
        setSelectedDateEvents(dayEvents);
      },
    );

    return () => unsubscribe();
  }, [user, selectedDate, viewMode]);

  const handleAddEvent = () => {
    console.log('Add event clicked - clearing selected event');
    setSelectedEvent(null);
    setModalVisible(true);
  };

  const handleEditEvent = (event: ICalendarEvent) => {
    console.log('Edit event clicked:', event.id, event.title);
    setSelectedEvent(event);
    setModalVisible(true);
  };

  const handleSaveEvent = async (eventData: IEventFormData) => {
    try {
      if (!user?.uid) return;

      if (selectedEvent) {
        await eventService.updateEvent(selectedEvent.id, eventData);

        if (eventData.notificationEnabled) {
          await notificationService.scheduleEventNotification({
            ...selectedEvent,
            ...eventData,
          });
        } else {
          await notificationService.cancelNotification(selectedEvent.id);
        }
      } else {
        const eventId = await eventService.createEvent(user.uid, eventData);

        if (eventData.notificationEnabled) {
          console.log('About to call scheduleEventNotification');
          const notifId = await notificationService.scheduleEventNotification({
            id: eventId,
            userId: user.uid,
            ...eventData,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
          console.log('scheduleEventNotification returned:', notifId);
        }
      }
    } catch (error) {
      console.error('Error saving event:', error);
      Alert.alert('Error', 'Failed to save event');
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    try {
      await eventService.deleteEvent(eventId);
      await notificationService.cancelNotification(eventId);
    } catch (error) {
      console.error('Error deleting event:', error);
      Alert.alert('Error', 'Failed to delete event');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <CustomHeader
        title="Calendar"
        rightComponent={
          <TouchableOpacity onPress={handleAddEvent} style={styles.addButton}>
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        }
      />
      {/* View Toggle */}
      <View style={styles.viewToggle}>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            viewMode === 'month' && styles.toggleButtonActive,
          ]}
          onPress={() => viewMode !== 'month' && toggleViewMode()}
        >
          <Text
            style={[
              styles.toggleButtonText,
              viewMode === 'month' && styles.toggleButtonTextActive,
            ]}
          >
            {LABELS.month}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            viewMode === 'day' && styles.toggleButtonActive,
          ]}
          onPress={() => viewMode !== 'day' && toggleViewMode()}
        >
          <Text
            style={[
              styles.toggleButtonText,
              viewMode === 'day' && styles.toggleButtonTextActive,
            ]}
          >
            {LABELS.day}
          </Text>
        </TouchableOpacity>
      </View>

      {viewMode === 'month' ? (
        <ScrollView style={styles.content}>
          <View style={styles.calendarCard}>
            <Calendar
              events={events}
              onDateSelect={handleDateSelect}
              selectedDate={selectedDate}
            />
          </View>

          {/* Events for Selected Date */}
          <View style={styles.eventsCard}>
            <Text style={styles.sectionTitle}>
              {LABELS.eventsOn} {formatDate(selectedDate)}
            </Text>
            <EventList
              events={selectedDateEvents}
              onEventPress={handleEditEvent}
              emptyMessage={LABELS.noUpcomingEvents}
            />
          </View>
        </ScrollView>
      ) : (
        <DayView
          events={selectedDateEvents}
          selectedDate={selectedDate}
          onDateChange={handleDateSelect}
          onEventPress={handleEditEvent}
        />
      )}
      <EventModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleSaveEvent}
        onDelete={selectedEvent ? handleDeleteEvent : undefined}
        event={selectedEvent}
        initialDate={selectedDate}
      />
    </SafeAreaView>
  );
};

export default CalendarScreen;

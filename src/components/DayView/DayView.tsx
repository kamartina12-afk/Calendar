import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { formatDayMonth } from '../../utils/dateUtils';
import { EventList } from '../EventList/EventList';
import styles from './styles';
import { IDayViewProps } from './types/types';

export const DayView: React.FC<IDayViewProps> = ({
  events,
  selectedDate,
  onDateChange,
  onEventPress,
}) => {
  const goToPreviousDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 1);
    onDateChange(newDate);
  };

  const goToNextDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 1);
    onDateChange(newDate);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={goToPreviousDay} style={styles.arrowButton}>
          <Text style={styles.arrow}>{'<'}</Text>
        </TouchableOpacity>

        <View style={styles.dateInfo}>
          <Text style={styles.dayText}>{formatDayMonth(selectedDate)}</Text>
        </View>

        <TouchableOpacity onPress={goToNextDay} style={styles.arrowButton}>
          <Text style={styles.arrow}>{'>'}</Text>
        </TouchableOpacity>
      </View>
      <EventList
        events={events}
        onEventPress={onEventPress}
        emptyMessage="No events scheduled for this day"
      />
    </View>
  );
};

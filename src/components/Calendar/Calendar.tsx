import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { useCalendar } from '../../hooks/useCalendar';
import { styles } from './styles';
import { DAYS, MONTHS } from '../../constants/CalendarConstants';
import {
  isDayToday,
  isDaySelected,
  dayHasEvent,
  createEventDateSet,
} from '../../utils/dateUtils';
import { ICalendarProps } from './types/types';

export const Calendar: React.FC<ICalendarProps> = ({
  events = [],
  onDateSelect,
  selectedDate: propSelectedDate,
}) => {
  const {
    month,
    year,
    daysInMonth,
    firstdayOffset,
    selectedDate: hookSelectedDate,
    today,
    goToNextMonth,
    goToPreviousMonth,
  } = useCalendar();

  const selectedDate = propSelectedDate || hookSelectedDate;

  const eventDates = useMemo(() => createEventDateSet(events), [events]);

  const handleDatePress = (day: number) => {
    const date = new Date(year, month, day);
    onDateSelect?.(date);
  };

  const daysArray = [
    ...Array(firstdayOffset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <View style={styles.calendarContainer}>
      <View style={styles.calendarHeader}>
        <TouchableOpacity onPress={goToPreviousMonth}>
          <Text style={styles.arrow}>{'<'}</Text>
        </TouchableOpacity>
        <Text style={styles.monthText}>
          {MONTHS[month]} {year}
        </Text>
        <TouchableOpacity onPress={goToNextMonth}>
          <Text style={styles.arrow}>{'>'}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.weekdays}>
        {DAYS.map(d => (
          <Text key={d} style={styles.weekdayText}>
            {d}
          </Text>
        ))}
      </View>
      <FlatList
        data={daysArray}
        numColumns={7}
        keyExtractor={(_, index) => index.toString()}
        scrollEnabled={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            disabled={!item}
            style={[
              styles.dayCell,
              item &&
                isDaySelected(item, month, year, selectedDate) &&
                styles.selectedDay,
              item &&
                isDayToday(item, month, year, today) &&
                !isDaySelected(item, month, year, selectedDate) &&
                styles.todayDay,
            ]}
            onPress={() => item && handleDatePress(item)}
          >
            <Text
              style={[
                styles.dayText,
                item &&
                  isDaySelected(item, month, year, selectedDate) &&
                  styles.selectedDayText,
                item &&
                  isDayToday(item, month, year, today) &&
                  !isDaySelected(item, month, year, selectedDate) &&
                  styles.todayText,
              ]}
            >
              {item ?? ''}
            </Text>
            {item && dayHasEvent(item, month, year, eventDates) && (
              <View
                style={[
                  styles.eventDot,
                  isDaySelected(item, month, year, selectedDate) &&
                    styles.eventDotSelected,
                ]}
              />
            )}
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

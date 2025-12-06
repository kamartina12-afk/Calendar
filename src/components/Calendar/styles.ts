import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  calendarContainer: {
    flex: 1,
    padding: 16,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  monthText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  arrow: {
    fontSize: 20,
    fontWeight: 'bold',
    padding: 8,
    color: '#6366f1',
  },
  weekdays: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 8,
  },
  weekdayText: {
    flex: 1,
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 12,
    color: '#6b7280',
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: '14.28%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4,
    position: 'relative',
  },
  dayText: {
    fontSize: 16,
    color: '#1f2937',
  },
  selectedDay: {
    backgroundColor: '#6366f1',
    borderRadius: 8,
  },
  selectedDayText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  todayDay: {
    borderWidth: 2,
    borderColor: '#6366f1',
    borderRadius: 8,
  },
  todayText: {
    color: '#6366f1',
    fontWeight: '600',
  },
  eventDot: {
    position: 'absolute',
    bottom: 4,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#6366f1',
  },
  eventDotSelected: {
    backgroundColor: '#ffffff',
  },
});
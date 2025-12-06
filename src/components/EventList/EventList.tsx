import React, { useCallback } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { ICalendarEvent } from '../../types/event';
import { LABELS } from './labels/labels';
import { styles } from './styles';
import { IEventListProps } from './types/types';

export const EventList: React.FC<IEventListProps> = ({
  events,
  onEventPress,
  emptyMessage = LABELS.emptyText,
}) => {
  const renderEvent = useCallback(
    ({ item }: { item: ICalendarEvent }) => (
      <TouchableOpacity
        style={styles.eventItem}
        onPress={() => onEventPress?.(item)}
      >
        <View style={styles.eventTimeContainer}>
          <Text style={styles.eventTime}>{item.time}</Text>
          {item.notificationEnabled && (
            <Text style={styles.notificationIcon}>
              {LABELS.notificationIcon}
            </Text>
          )}
        </View>
        <View style={styles.eventDetails}>
          <Text style={styles.eventTitle}>{item.title}</Text>
        </View>
      </TouchableOpacity>
    ),
    [onEventPress],
  );

  if (events.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>{LABELS.emptyIcon}</Text>
        <Text style={styles.emptyText}>{emptyMessage}</Text>
        <Text style={styles.emptySubtext}>{LABELS.emptySubtext}</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={events}
      renderItem={renderEvent}
      keyExtractor={item => item.id}
      scrollEnabled={false}
      contentContainerStyle={styles.listContainer}
    />
  );
};

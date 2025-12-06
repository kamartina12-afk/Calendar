import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  listContainer: {
    padding: 16,
  },
  eventItem: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  eventTimeContainer: {
    marginRight: 16,
    alignItems: 'center',
  },
  eventTime: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6366f1',
  },
  notificationIcon: {
    fontSize: 12,
    marginTop: 4,
  },
  eventDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1f2937',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
  },
});

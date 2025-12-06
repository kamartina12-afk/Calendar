import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  arrowButton: {
    padding: 8,
  },
  arrow: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6366f1',
  },
  dateInfo: {
    flex: 1,
    alignItems: 'center',
  },
  dayText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
});
export default styles;
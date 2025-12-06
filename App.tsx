/**
 * Calendar App with Firebase Authentication
 * @format
 */

import React, { useEffect } from 'react';
import { StatusBar, LogBox, PermissionsAndroid, Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/contexts/AuthContext';
import RootNavigator from './src/navigation/RootNavigator';
import { notificationService } from './src/services/notificationService';

function App() {
  useEffect(() => {
    LogBox.ignoreLogs(['VirtualizedLists should never be nested']);

    const requestNotificationPermissions = async () => {
      if (Platform.OS === 'android' && Platform.Version >= 33) {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
          );

          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            await notificationService.createChannel();
          }
        } catch (error) {
          console.error(
            '[APP] Error requesting notification permission:',
            error,
          );
        }
      } else {
        try {
          await notificationService.createChannel();
        } catch (error) {
          console.error('[APP] Error creating notification channel:', error);
        }
      }
    };

    requestNotificationPermissions();
  }, []);

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <StatusBar barStyle="dark-content" />
        <RootNavigator />
      </AuthProvider>
    </SafeAreaProvider>
  );
}

export default App;

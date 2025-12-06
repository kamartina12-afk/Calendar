import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomHeader from '../../components/Header/CustomHeader';
import { useAuth } from '../../contexts/AuthContext';
import {
  isBiometricsAvailable,
  getBiometricType,
} from '../../services/biometricService';
import styles from './styles';

const SettingsScreen: React.FC = () => {
  const {
    user,
    signOut,
    getBiometricUserId,
    clearBiometricData,
    getStoredCredentials,
  } = useAuth();
  const [isCurrentUserBiometric, setIsCurrentUserBiometric] = useState(false);
  const [biometricsAvailable, setBiometricsAvailable] = useState(false);

  useEffect(() => {
    checkBiometricStatus();
  }, [user]);

  const checkBiometricStatus = async () => {
    const available = await isBiometricsAvailable();
    setBiometricsAvailable(available);

    const bioUserId = await getBiometricUserId();
    setIsCurrentUserBiometric(bioUserId === user?.uid);
  };

  const handleDisableBiometrics = async () => {
    Alert.alert(
      'Disable Biometrics?',
      'You will need to sign in with your password next time.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Disable',
          style: 'destructive',
          onPress: async () => {
            await clearBiometricData();
            setIsCurrentUserBiometric(false);
            Alert.alert('Success', 'Biometric login disabled');
          },
        },
      ],
    );
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const userName = user?.email?.split('@')[0] || 'User';

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <CustomHeader
        title="Profile"
        rightComponent={
          <TouchableOpacity
            onPress={handleSignOut}
            style={styles.signOutButton}
          >
            <Text style={styles.signOutText}>Sign Out</Text>
          </TouchableOpacity>
        }
      />
      <ScrollView style={styles.content}>
        <View style={styles.profileCard}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>
              {userName.charAt(0).toUpperCase()}
            </Text>
          </View>
          <Text style={styles.userName}>{userName}</Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <View style={styles.card}>
            <Text style={styles.label}>Email</Text>
            <Text style={styles.value}>{user?.email}</Text>
          </View>
          {biometricsAvailable && isCurrentUserBiometric && (
            <TouchableOpacity
              style={styles.card}
              onPress={handleDisableBiometrics}
            >
              <Text style={styles.label}>Biometric Login</Text>
              <Text style={styles.value}>Enabled • Tap to disable</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <TouchableOpacity style={styles.card}>
            <Text style={styles.label}>Notifications</Text>
            <Text style={styles.value}>Enabled</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.card}>
            <Text style={styles.label}>Theme</Text>
            <Text style={styles.value}>Light</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SettingsScreen;

import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, Easing, ActivityIndicator } from 'react-native';
import styles from './styles';

const SplashScreen: React.FC = () => {
  const spinValue = useRef(new Animated.Value(0)).current;
  const fadeValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeValue, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();
  }, []);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.logoContainer, { opacity: fadeValue }]}>
        <View style={styles.logoPlaceholder}>
          <Text style={styles.logoText}>📅</Text>
        </View>
        <Text style={styles.appName}>Calendar</Text>
      </Animated.View>

      <Animated.View style={{ transform: [{ rotate: spin }] }}>
        <ActivityIndicator size="large" color="#007AFF" />
      </Animated.View>
    </View>
  );
};

export default SplashScreen;

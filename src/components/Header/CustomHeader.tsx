import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CustomHeaderProps } from './types/types';
import { styles } from './styles';

const CustomHeader: React.FC<CustomHeaderProps> = ({
  title,
  onBackPress,
  rightComponent,
  showBackButton = false,
}) => {
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#6366f1" />
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <View style={styles.header}>
          <View style={styles.leftContainer}>
            {showBackButton && onBackPress && (
              <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
                <Text style={styles.backButtonText}>←</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.centerContainer}>
            <Text style={styles.title}>{title}</Text>
          </View>

          <View style={styles.rightContainer}>{rightComponent}</View>
        </View>
      </SafeAreaView>
    </>
  );
};

export default CustomHeader;

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { useAuth } from '../../contexts/AuthContext';
import {
  authenticateWithBiometrics,
  isBiometricsAvailable,
  getBiometricType,
} from '../../services/biometricService';

import styles from './styles';
import { Props, ISignInFormData } from './types/types';
import { LABELS } from './labels/labels';

const SignInScreen: React.FC<Props> = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [biometricsAvailable, setBiometricsAvailable] = useState(false);
  const [biometricType, setBiometricType] = useState<string | null>(null);
  const {
    signIn,
    biometricsEnabled,
    getStoredCredentials,
    getBiometricUserId,
  } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ISignInFormData>({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  useEffect(() => {
    checkBiometrics();
  }, []);

  const checkBiometrics = async () => {
    try {
      const available = await isBiometricsAvailable();
      setBiometricsAvailable(available);
      if (available) {
        const type = await getBiometricType();
        setBiometricType(type);
      }
    } catch (error) {
      console.error('[SignIn] Error in checkBiometrics:', error);
    }
  };

  const handleBiometricSignIn = async () => {
    try {
      const success = await authenticateWithBiometrics();

      if (success) {
        const credentials = await getStoredCredentials();

        if (credentials) {
          setLoading(true);
          try {
            await signIn(credentials.email, credentials.password);
          } catch (error: any) {
            Alert.alert(LABELS.signInFailed, LABELS.anError);
          } finally {
            setLoading(false);
          }
        } else {
          Alert.alert(LABELS.noStoredCredentials);
        }
      }
    } catch (error) {
      Alert.alert(LABELS.biometricAuthFailed);
    }
  };

  const onSubmit = async (data: ISignInFormData) => {
    setLoading(true);
    try {
      await signIn(data.email, data.password);
    } catch (error: any) {
      Alert.alert(LABELS.signInFailed, error.message || LABELS.anError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.content}>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Sign in to continue</Text>

        <View style={styles.form}>
          <Controller
            control={control}
            name="email"
            rules={{
              required: LABELS.emailRequired,
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: LABELS.invalidEmailAddress,
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <>
                <TextInput
                  style={[styles.input, errors.email && styles.inputError]}
                  placeholder="Email"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  editable={!loading}
                />
                {errors.email && (
                  <Text style={styles.errorText}>{errors.email.message}</Text>
                )}
              </>
            )}
          />

          <Controller
            control={control}
            name="password"
            rules={{
              required: LABELS.passwordRequired,
              minLength: {
                value: 6,
                message: LABELS.passwordMinLength,
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <>
                <TextInput
                  style={[styles.input, errors.password && styles.inputError]}
                  placeholder={LABELS.passwordPlaceholder}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  secureTextEntry
                  editable={!loading}
                />
                {errors.password && (
                  <Text style={styles.errorText}>
                    {errors.password.message}
                  </Text>
                )}
              </>
            )}
          />

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleSubmit(onSubmit)}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>{LABELS.signInButton}</Text>
            )}
          </TouchableOpacity>

          {biometricsAvailable && biometricsEnabled && (
            <TouchableOpacity
              style={styles.biometricButton}
              onPress={handleBiometricSignIn}
              disabled={loading}
            >
              <Text style={styles.biometricButtonText}>
                {biometricType === 'FaceID'
                  ? `👤 ${LABELS.faceId}`
                  : biometricType === 'TouchID'
                  ? `👆 ${LABELS.touchId}`
                  : `🔒 ${LABELS.biometric}`}
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.linkButton}
            onPress={() => navigation.navigate('SignUp')}
            disabled={loading}
          >
            <Text style={styles.linkText}>
              {LABELS.dontHaveAccount}{' '}
              <Text style={styles.linkBold}>{LABELS.signUpHere}</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default SignInScreen;

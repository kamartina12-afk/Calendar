import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Switch,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { useAuth } from '../../contexts/AuthContext';
import {
  isBiometricsAvailable,
  getBiometricType,
} from '../../services/biometricService';
import { ISignUpFormData, Props } from './types/types';
import styles from './styles';

const SignUpScreen: React.FC<Props> = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [biometricsAvailable, setBiometricsAvailable] = useState(false);
  const [biometricType, setBiometricType] = useState<string | null>(null);
  const {
    signUp,
    setBiometricsEnabled,
    saveCredentials,
    getBiometricUserId,
    getStoredCredentials,
  } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ISignUpFormData>({
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      enableBiometrics: false,
    },
  });

  const password = watch('password');

  React.useEffect(() => {
    checkBiometrics();
  }, []);

  const checkBiometrics = async () => {
    const available = await isBiometricsAvailable();
    setBiometricsAvailable(available);
    if (available) {
      const type = await getBiometricType();
      setBiometricType(type);
    }
  };

  const onSubmit = async (data: ISignUpFormData) => {
    setLoading(true);
    try {
      await signUp(data.email, data.password);

      if (data.enableBiometrics) {
        const existingBioUserId = await getBiometricUserId();
        const existingCredentials = await getStoredCredentials();

        if (existingBioUserId && existingCredentials) {
          Alert.alert(
            'Replace Biometric Account?',
            `Another account (${existingCredentials.email}) is already enrolled for biometric login. Enabling this will replace it.`,
            [
              {
                text: 'Cancel',
                style: 'cancel',
                onPress: () => {
                  Alert.alert(
                    'Success',
                    'Account created! Biometrics not enabled.',
                  );
                },
              },
              {
                text: 'Replace',
                onPress: async () => {
                  await setBiometricsEnabled(true);
                  await saveCredentials(data.email, data.password);
                  Alert.alert(
                    'Success',
                    'Account created and biometrics enabled!',
                  );
                },
              },
            ],
            { cancelable: false },
          );
        } else {
          await setBiometricsEnabled(true);
          await saveCredentials(data.email, data.password);
          Alert.alert('Successs', 'Account created successfully!');
        }
      } else {
        Alert.alert('Success', 'Account created successfully!');
      }
    } catch (error: any) {
      let errorMessage = 'An error occurred';
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'This email is already registered';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password is too weak';
      }
      Alert.alert('Sign Up Failed', errorMessage);
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
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Sign up to get started</Text>

        <View style={styles.form}>
          <Controller
            control={control}
            name="email"
            rules={{
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address',
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
              required: 'Password is required',
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters',
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <>
                <TextInput
                  style={[styles.input, errors.password && styles.inputError]}
                  placeholder="Password"
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

          <Controller
            control={control}
            name="confirmPassword"
            rules={{
              required: 'Please confirm your password',
              validate: value => value === password || 'Passwords do not match',
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <>
                <TextInput
                  style={[
                    styles.input,
                    errors.confirmPassword && styles.inputError,
                  ]}
                  placeholder="Confirm Password"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  secureTextEntry
                  editable={!loading}
                />
                {errors.confirmPassword && (
                  <Text style={styles.errorText}>
                    {errors.confirmPassword.message}
                  </Text>
                )}
              </>
            )}
          />

          {biometricsAvailable && (
            <Controller
              control={control}
              name="enableBiometrics"
              render={({ field: { onChange, value } }) => (
                <View style={styles.biometricOption}>
                  <View style={styles.biometricTextContainer}>
                    <Text style={styles.biometricLabel}>
                      Enable{' '}
                      {biometricType === 'FaceID'
                        ? 'Face ID'
                        : biometricType === 'TouchID'
                        ? 'Touch ID'
                        : 'Biometric'}{' '}
                      Authentication
                    </Text>
                    <Text style={styles.biometricSubtext}>
                      Sign in faster with biometrics
                    </Text>
                  </View>
                  <Switch
                    value={value}
                    onValueChange={onChange}
                    disabled={loading}
                  />
                </View>
              )}
            />
          )}

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleSubmit(onSubmit)}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>Sign Up</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.linkButton}
            onPress={() => navigation.navigate('SignIn')}
            disabled={loading}
          >
            <Text style={styles.linkText}>
              Already have an account?{' '}
              <Text style={styles.linkBold}>Sign In</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default SignUpScreen;

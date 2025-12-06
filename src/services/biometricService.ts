const ReactNativeBiometrics = require('react-native-biometrics').default;
const { BiometryTypes } = require('react-native-biometrics');

const rnBiometrics = new ReactNativeBiometrics();

export const isBiometricsAvailable = async (): Promise<boolean> => {
  try {
    const { available } = await rnBiometrics.isSensorAvailable();
    return available;
  } catch (error) {
    console.log('Error checking biometric availability:', error);
    return false;
  }
};

export const authenticateWithBiometrics = async (
  reason: string = 'Authenticate to access your account'
): Promise<boolean> => {
  try {
    const { success } = await rnBiometrics.simplePrompt({
      promptMessage: reason,
      cancelButtonText: 'Cancel',
    });
    return success;
  } catch (error) {
    console.log('Biometric authentication failed:', error);
    return false;
  }
};

export const getBiometricType = async (): Promise<string | null> => {
  try {
    const { available, biometryType } = await rnBiometrics.isSensorAvailable();
    
    if (!available) {
      return null;
    }

    switch (biometryType) {
      case BiometryTypes.TouchID:
        return 'TouchID';
      case BiometryTypes.FaceID:
        return 'FaceID';
      case BiometryTypes.Biometrics:
        return 'Fingerprint';
      default:
        return 'Biometrics';
    }
  } catch (error) {
    console.log('Error getting biometric type:', error);
    return null;
  }
};

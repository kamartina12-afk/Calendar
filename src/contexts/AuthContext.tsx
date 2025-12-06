import React, { createContext, useContext, useEffect, useState } from 'react';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface IStoredCredentials {
  email: string;
  password: string;
}

interface AuthContextType {
  user: FirebaseAuthTypes.User | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  biometricsEnabled: boolean;
  setBiometricsEnabled: (enabled: boolean) => Promise<void>;
  getStoredCredentials: () => Promise<IStoredCredentials | null>;
  saveCredentials: (email: string, password: string) => Promise<void>;
  getBiometricUserId: () => Promise<string | null>;
  clearBiometricData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signUp: async () => {},
  signIn: async () => {},
  signOut: async () => {},
  biometricsEnabled: false,
  setBiometricsEnabled: async () => {},
  getStoredCredentials: async () => null,
  saveCredentials: async () => {},
  getBiometricUserId: async () => null,
  clearBiometricData: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [loading, setLoading] = useState(true);
  const [biometricsEnabled, setBiometricsEnabledState] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem('biometricsEnabled').then(value => {
      if (value === 'true') setBiometricsEnabledState(true);
    });
  }, []);

  useEffect(() => {
    const unsub = auth().onAuthStateChanged(current => {
      setUser(current);
      setLoading(false);
    });
    return unsub;
  }, []);

  const setBiometricsEnabled = async (enabled: boolean) => {
    setBiometricsEnabledState(enabled);
    await AsyncStorage.setItem('biometricsEnabled', enabled ? 'true' : 'false');
  };

  const signUp = async (email: string, password: string) => {
    await auth().createUserWithEmailAndPassword(email, password);
  };

  const signIn = async (email: string, password: string) => {
    await auth().signInWithEmailAndPassword(email, password);
  };

  const signOut = async () => {
    await auth().signOut();
  };

  const saveCredentials = async (email: string, password: string) => {
    const credentials: IStoredCredentials = { email, password };
    const userId = auth().currentUser?.uid;

    await AsyncStorage.setItem('userCredentials', JSON.stringify(credentials));
    if (userId) {
      await AsyncStorage.setItem('biometricUserId', userId);
    }
  };

  const getStoredCredentials = async (): Promise<IStoredCredentials | null> => {
    try {
      const stored = await AsyncStorage.getItem('userCredentials');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  };

  const getBiometricUserId = async (): Promise<string | null> => {
    try {
      return await AsyncStorage.getItem('biometricUserId');
    } catch {
      return null;
    }
  };

  const clearBiometricData = async () => {
    await AsyncStorage.removeItem('userCredentials');
    await AsyncStorage.removeItem('biometricUserId');
    await setBiometricsEnabled(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signUp,
        signIn,
        signOut,
        biometricsEnabled,
        setBiometricsEnabled,
        saveCredentials,
        getStoredCredentials,
        getBiometricUserId,
        clearBiometricData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

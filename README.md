# Calendar App

A React Native calendar application with Firebase authentication, event management, and biometric login support.

## Features

- Monthly and daily calendar views
- Create, edit, and delete events
- Event notifications with scheduled reminders
- Firebase authentication (Email/Password)
- Biometric authentication (Fingerprint/Face ID)
- Real-time event synchronization
- Native Android and iOS support

## Technologies

- React Native 0.82.1 with TypeScript
- Firebase (Authentication & Firestore)
- React Navigation (Stack + Bottom Tabs)
- Biometric authentication
- Local notifications (@notifee)
- React Hook Form

**Note**: Custom-built calendar grid component - no third-party calendar libraries used.

## Prerequisites

- Node.js 18+
- React Native CLI
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)
- Firebase project with Firestore and Authentication enabled

## Firebase Setup

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)

2. Enable Authentication:

   - Go to Authentication → Sign-in method
   - Enable Email/Password provider

3. Create Firestore database:

   - Go to Firestore Database
   - Create database (start in test mode for development)
   - Add security rules (see below)

4. Add your app to Firebase:
   - **Android**: Download `google-services.json` → `android/app/`
   - **iOS**: Download `GoogleService-Info.plist` → `ios/Calendar/`

### Firestore Indexes

Create composite indexes for efficient queries:

```
Collection: events
Fields: userId (Ascending), date (Ascending)
```

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd Calendar
```

2. Install dependencies:

```bash
npm install
```

3. Install iOS pods (macOS only):

```bash
cd ios && pod install && cd ..
```

4. Add Firebase configuration files:
   - Place `google-services.json` in `android/app/`
   - Place `GoogleService-Info.plist` in `ios/Calendar/`

## Running the App

### Android

```bash
npm run android
```

### iOS (macOS only)

```bash
npm run ios
```

### Android Emulator Setup

1. Enable screen lock:

   - Settings → Security → Screen lock → Set PIN/Pattern

2. Enroll fingerprint:

   - Settings → Security → Fingerprint
   - During enrollment, use this command:

   ```bash
   adb -e emu finger touch 12345
   ```

   - Run multiple times as prompted

3. Test authentication:
   - When biometric prompt appears, run:
   ```bash
   adb -e emu finger touch 12345
   ```

### iOS Simulator

- Use Touch ID: Hardware → Touch ID → Enrolled
- Trigger authentication: Hardware → Touch ID → Matching Touch

## Project Structure

```
components/         # Reusable UI components
contexts/           # React Context providers
navigation/         # Navigation configuration
screens/            # Screen components
services/           # Business logic services
android/            # Android native code
ios/                # iOS native code
App.tsx             # App entry point
```

## Known Issues & Troubleshooting

### Notifications Not Appearing

**Emulator**: Android emulators are unreliable for scheduled notifications. Test on a physical device.

**Android 13+**: Ensure POST_NOTIFICATIONS permission is granted when prompted.

### Build Errors

**Android**:

```bash
cd android && ./gradlew clean && cd ..
npm run android
```

**iOS**:

```bash
cd ios && pod deinstall && pod install && cd ..
npm run ios
```

## Testing

Run tests:

```bash
npm test
```

Run tests with coverage:

```bash
npm test -- --coverage
```

## License

Private project - All rights reserved

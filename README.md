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

**Important**: These files contain your Firebase API keys and are automatically gitignored for security. They are:

- Used by Firebase SDK to connect your app to your Firebase project
- Required for authentication and Firestore database access
- Automatically loaded at app startup (no manual initialization needed)
- Never commit these files to version control

### Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /events/{eventId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
  }
}
```

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

## Android Permissions

The app requires the following permissions:

- **POST_NOTIFICATIONS** - Display notifications (Android 13+)
- **SCHEDULE_EXACT_ALARM** - Schedule notifications at exact times (Android 12+)
- **USE_EXACT_ALARM** - Use alarm functionality (Android 12+)
- **INTERNET** - Firebase connectivity
- **USE_BIOMETRIC** - Fingerprint authentication
- **USE_FINGERPRINT** - Legacy fingerprint support

## Testing Biometric Authentication on Emulator

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
Calendar/
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── Calendar/       # Calendar grid component
│   │   ├── DayView/        # Single day event view
│   │   ├── EventList/      # Event list component
│   │   ├── EventModal/     # Event creation/edit modal
│   │   ├── Header/         # Custom header component
│   │   └── ViewToggle/     # Month/Day view toggle
│   ├── contexts/           # React Context providers
│   │   └── AuthContext.tsx # Authentication state
│   ├── navigation/         # Navigation configuration
│   │   ├── AppNavigator.tsx   # Main app navigation (tabs)
│   │   ├── AuthNavigator.tsx  # Auth flow navigation
│   │   └── RootNavigator.tsx  # Root navigation switch
│   ├── screens/            # Screen components
│   │   ├── Calendar/       # Calendar screen
│   │   ├── SignIn/         # Sign in screen
│   │   ├── SignUp/         # Sign up screen
│   │   └── User/           # User profile screen
│   ├── services/           # Business logic services
│   │   ├── authService.ts     # Authentication operations
│   │   ├── biometricService.ts # Biometric authentication
│   │   ├── eventService.ts    # Event CRUD operations
│   │   └── notificationService.ts # Notification scheduling
│   ├── types/              # TypeScript type definitions
│   ├── utils/              # Utility functions
│   │   └── dateUtils.ts    # Date formatting and manipulation
│   └── config/             # Configuration files
│       └── firebase.ts     # Firebase initialization
├── android/                # Android native code
├── ios/                    # iOS native code
└── App.tsx                 # App entry point
```

## Known Issues & Troubleshooting

### Notifications Not Appearing

**Emulator**: Android emulators are unreliable for scheduled notifications. Test on a physical device.

**MIUI/Xiaomi Devices**:

- Go to Settings → Battery & performance → App battery saver
- Select Calendar app → No restrictions
- This prevents MIUI from killing background processes

**Android 13+**: Ensure POST_NOTIFICATIONS permission is granted when prompted.

### Biometric Authentication Issues

- Ensure screen lock is enabled on device/emulator
- Verify biometric enrollment in device settings
- Check that USE_BIOMETRIC permission is in manifest

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

## Development Tips

- Use LogBox to suppress known warnings (VirtualizedList)
- Firebase listeners auto-unsubscribe on component unmount
- Date handling uses local timezone (not UTC) for consistency
- Notifications require channel creation before scheduling

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

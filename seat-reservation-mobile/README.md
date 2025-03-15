# Seat Reservation Mobile App

A mobile application for the Seat Reservation System, allowing users to book workspaces, manage reservations, and view floor plans on the go.

Created by DigitalHoldingsGroup LLC. All rights reserved.  
Repository: https://github.com/RedClaus/Seatreservation

## Features

- **Authentication**: Secure login and user profile management
- **Dashboard**: Overview of upcoming reservations and team locations
- **Reservations**: View, create, and manage workspace reservations
- **Space Search**: Find available workspaces based on various criteria
- **Floor Plans**: Interactive floor plans to visualize and select workspaces
- **Profile**: User preferences and account settings

## Technology Stack

- **Framework**: React Native with Expo
- **State Management**: Redux Toolkit
- **UI Components**: React Native Paper
- **Navigation**: React Navigation
- **API Communication**: Axios
- **Animations**: React Native Reanimated
- **SVG Rendering**: React Native SVG
- **Gesture Handling**: React Native Gesture Handler

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Expo CLI
- iOS Simulator or Android Emulator (optional for mobile testing)

### Installation

1. Clone the repository
   ```
   git clone https://github.com/RedClaus/Seatreservation.git
   cd Seatreservation/seat-reservation-mobile
   ```

2. Install dependencies
   ```
   npm install
   # or
   yarn install
   ```

3. Start the development server
   ```
   npm start
   # or
   yarn start
   ```

4. Follow the instructions in the terminal to open the app on your device or emulator

### Running on Physical Devices

1. Install the Expo Go app on your iOS or Android device
2. Scan the QR code displayed in the terminal or Expo Dev Tools
3. The app will open in Expo Go

## Project Structure

```
seat-reservation-mobile/
├── assets/                 # Static assets like images and fonts
├── src/
│   ├── components/         # Reusable UI components
│   ├── navigation/         # Navigation configuration
│   ├── screens/            # Screen components
│   │   ├── auth/           # Authentication screens
│   │   ├── dashboard/      # Dashboard screens
│   │   ├── floorplan/      # Floor plan screens
│   │   ├── profile/        # Profile screens
│   │   ├── reservations/   # Reservation screens
│   │   └── spaces/         # Space search screens
│   ├── services/           # API services
│   ├── store/              # Redux store configuration
│   │   └── slices/         # Redux slices
│   └── utils/              # Utility functions and constants
├── App.tsx                 # Main application component
├── app.json                # Expo configuration
├── babel.config.js         # Babel configuration
├── package.json            # Project dependencies
└── tsconfig.json           # TypeScript configuration
```

## Development

### Code Style

This project uses TypeScript for type safety. Make sure to define proper types for all components, props, and state.

### State Management

Redux Toolkit is used for state management. Each feature has its own slice in the `src/store/slices` directory.

### UI Components

React Native Paper is used for UI components. Refer to their documentation for available components and customization options.

## Building for Production

### Expo Build

To create a production build:

```
expo build:android  # For Android
expo build:ios      # For iOS
```

### EAS Build

For more advanced build configurations, use EAS Build:

```
eas build --platform android
eas build --platform ios
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

© 2025 DigitalHoldingsGroup LLC. All rights reserved.

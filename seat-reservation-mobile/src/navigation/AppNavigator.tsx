import React, { useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSelector, useDispatch } from 'react-redux';
import { MaterialIcons } from '@expo/vector-icons';

// Screens
import LoginScreen from '../screens/auth/LoginScreen';
import DashboardScreen from '../screens/dashboard/DashboardScreen';
import ReservationListScreen from '../screens/reservations/ReservationListScreen';
import ReservationDetailsScreen from '../screens/reservations/ReservationDetailsScreen';
import SpaceSearchScreen from '../screens/spaces/SpaceSearchScreen';
import SpaceDetailsScreen from '../screens/spaces/SpaceDetailsScreen';
import FloorPlanScreen from '../screens/floorplan/FloorPlanScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';

// Redux
import { RootState } from '../store';
import { checkAuth } from '../store/slices/authSlice';

// Types
import { AppDispatch } from '../store';

// Define the types for our navigation stacks
export type AuthStackParamList = {
  Login: undefined;
};

export type MainStackParamList = {
  MainTabs: undefined;
  ReservationDetails: { id: string };
  SpaceDetails: { id: string };
};

export type MainTabsParamList = {
  Dashboard: undefined;
  Reservations: undefined;
  Spaces: undefined;
  FloorPlan: undefined;
  Profile: undefined;
};

// Create the navigators
const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const MainStack = createNativeStackNavigator<MainStackParamList>();
const MainTabs = createBottomTabNavigator<MainTabsParamList>();

// Main tabs navigator
const MainTabsNavigator = () => {
  return (
    <MainTabs.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#0052CC',
        tabBarInactiveTintColor: '#6B778C',
        tabBarLabelStyle: {
          fontSize: 12,
        },
        tabBarStyle: {
          paddingBottom: 5,
          height: 60,
        },
        headerShown: false,
      }}
    >
      <MainTabs.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="dashboard" size={size} color={color} />
          ),
        }}
      />
      <MainTabs.Screen
        name="Reservations"
        component={ReservationListScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="event" size={size} color={color} />
          ),
        }}
      />
      <MainTabs.Screen
        name="Spaces"
        component={SpaceSearchScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="meeting-room" size={size} color={color} />
          ),
        }}
      />
      <MainTabs.Screen
        name="FloorPlan"
        component={FloorPlanScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="map" size={size} color={color} />
          ),
          tabBarLabel: 'Floor Plan',
        }}
      />
      <MainTabs.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="person" size={size} color={color} />
          ),
        }}
      />
    </MainTabs.Navigator>
  );
};

// Auth stack navigator
const AuthNavigator = () => {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
    </AuthStack.Navigator>
  );
};

// Main stack navigator
const MainNavigator = () => {
  return (
    <MainStack.Navigator>
      <MainStack.Screen
        name="MainTabs"
        component={MainTabsNavigator}
        options={{ headerShown: false }}
      />
      <MainStack.Screen
        name="ReservationDetails"
        component={ReservationDetailsScreen}
        options={{ title: 'Reservation Details' }}
      />
      <MainStack.Screen
        name="SpaceDetails"
        component={SpaceDetailsScreen}
        options={{ title: 'Space Details' }}
      />
    </MainStack.Navigator>
  );
};

// Root navigator
const AppNavigator = () => {
  const { isAuthenticated, isLoading } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  if (isLoading) {
    // In a real app, we would show a splash screen here
    return null;
  }

  return isAuthenticated ? <MainNavigator /> : <AuthNavigator />;
};

export default AppNavigator;

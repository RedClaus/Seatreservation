import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { 
  Text, 
  Card, 
  Avatar, 
  Button, 
  Divider, 
  List, 
  Switch, 
  TextInput,
  useTheme,
  Dialog,
  Portal
} from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { RootState, AppDispatch } from '../../store';
import { logout } from '../../store/slices/authSlice';
import { MainStackParamList } from '../../navigation/AppNavigator';

type NavigationProp = NativeStackNavigationProp<MainStackParamList>;

const ProfileScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const dispatch = useDispatch<AppDispatch>();
  
  const { user } = useSelector((state: RootState) => state.auth);
  
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [reminderTime, setReminderTime] = useState('30');
  const [defaultBuilding, setDefaultBuilding] = useState('Headquarters');
  const [logoutDialogVisible, setLogoutDialogVisible] = useState(false);
  const [editProfileDialogVisible, setEditProfileDialogVisible] = useState(false);
  
  // Edit profile form state
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [department, setDepartment] = useState(user?.department || '');
  
  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      // Navigation will be handled by the auth state change in AppNavigator
    } catch (error) {
      Alert.alert('Error', 'Failed to log out');
    }
  };
  
  const handleSaveProfile = () => {
    // In a real app, this would dispatch an action to update the user profile
    Alert.alert('Success', 'Profile updated successfully');
    setEditProfileDialogVisible(false);
  };
  
  const handleSavePreferences = () => {
    // In a real app, this would dispatch an action to update the user preferences
    Alert.alert('Success', 'Preferences updated successfully');
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.profileCard}>
        <Card.Content>
          <View style={styles.profileHeader}>
            <Avatar.Text 
              size={80} 
              label={user?.name?.split(' ').map(n => n[0]).join('') || 'U'} 
              backgroundColor={theme.colors.primary}
            />
            <View style={styles.profileInfo}>
              <Text style={styles.name}>{user?.name || 'User'}</Text>
              <Text style={styles.email}>{user?.email || 'user@company.com'}</Text>
              <Text style={styles.department}>{user?.department || 'Department'}</Text>
            </View>
          </View>
          
          <Button 
            mode="outlined" 
            onPress={() => setEditProfileDialogVisible(true)}
            style={styles.editButton}
            icon="account-edit"
          >
            Edit Profile
          </Button>
        </Card.Content>
      </Card>
      
      <Card style={styles.card}>
        <Card.Title title="Notification Preferences" />
        <Card.Content>
          <List.Item
            title="Email Notifications"
            description="Receive booking confirmations and reminders via email"
            right={() => (
              <Switch
                value={emailNotifications}
                onValueChange={setEmailNotifications}
                color={theme.colors.primary}
              />
            )}
          />
          <Divider />
          <List.Item
            title="Push Notifications"
            description="Receive booking confirmations and reminders via push notifications"
            right={() => (
              <Switch
                value={pushNotifications}
                onValueChange={setPushNotifications}
                color={theme.colors.primary}
              />
            )}
          />
          <Divider />
          <List.Item
            title="Reminder Time"
            description="Minutes before reservation to send reminder"
            right={() => (
              <TextInput
                value={reminderTime}
                onChangeText={setReminderTime}
                keyboardType="number-pad"
                style={styles.reminderInput}
                mode="outlined"
              />
            )}
          />
        </Card.Content>
      </Card>
      
      <Card style={styles.card}>
        <Card.Title title="Workspace Preferences" />
        <Card.Content>
          <List.Item
            title="Default Building"
            description="Building to show by default when booking"
            right={() => (
              <TextInput
                value={defaultBuilding}
                onChangeText={setDefaultBuilding}
                style={styles.buildingInput}
                mode="outlined"
              />
            )}
          />
          
          <Button 
            mode="contained" 
            onPress={handleSavePreferences}
            style={styles.saveButton}
            icon="content-save"
          >
            Save Preferences
          </Button>
        </Card.Content>
      </Card>
      
      <Card style={styles.card}>
        <Card.Title title="Account" />
        <Card.Content>
          <List.Item
            title="Change Password"
            left={() => <List.Icon icon="lock-reset" />}
            right={() => <MaterialIcons name="chevron-right" size={24} color="#6B778C" />}
            onPress={() => Alert.alert('Info', 'Password change functionality would be implemented here')}
          />
          <Divider />
          <List.Item
            title="Privacy Policy"
            left={() => <List.Icon icon="shield-account" />}
            right={() => <MaterialIcons name="chevron-right" size={24} color="#6B778C" />}
            onPress={() => Alert.alert('Info', 'Privacy policy would be shown here')}
          />
          <Divider />
          <List.Item
            title="Terms of Service"
            left={() => <List.Icon icon="file-document" />}
            right={() => <MaterialIcons name="chevron-right" size={24} color="#6B778C" />}
            onPress={() => Alert.alert('Info', 'Terms of service would be shown here')}
          />
          <Divider />
          <List.Item
            title="Logout"
            left={() => <List.Icon icon="logout" color="#FF5630" />}
            onPress={() => setLogoutDialogVisible(true)}
            titleStyle={{ color: '#FF5630' }}
          />
        </Card.Content>
      </Card>
      
      <View style={styles.versionContainer}>
        <Text style={styles.versionText}>Version 1.0.0</Text>
        <Text style={styles.versionText}>© 2025 DigitalHoldingsGroup LLC</Text>
        <Text style={styles.versionText}>All rights reserved</Text>
      </View>
      
      {/* Logout Confirmation Dialog */}
      <Portal>
        <Dialog visible={logoutDialogVisible} onDismiss={() => setLogoutDialogVisible(false)}>
          <Dialog.Title>Logout</Dialog.Title>
          <Dialog.Content>
            <Text>Are you sure you want to log out?</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setLogoutDialogVisible(false)}>Cancel</Button>
            <Button onPress={handleLogout} textColor="#FF5630">Logout</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      
      {/* Edit Profile Dialog */}
      <Portal>
        <Dialog visible={editProfileDialogVisible} onDismiss={() => setEditProfileDialogVisible(false)}>
          <Dialog.Title>Edit Profile</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Name"
              value={name}
              onChangeText={setName}
              mode="outlined"
              style={styles.dialogInput}
            />
            <TextInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              mode="outlined"
              style={styles.dialogInput}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TextInput
              label="Department"
              value={department}
              onChangeText={setDepartment}
              mode="outlined"
              style={styles.dialogInput}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setEditProfileDialogVisible(false)}>Cancel</Button>
            <Button onPress={handleSaveProfile}>Save</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  profileCard: {
    margin: 16,
    elevation: 2,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileInfo: {
    marginLeft: 16,
    flex: 1,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  email: {
    fontSize: 14,
    color: '#6B778C',
    marginTop: 4,
  },
  department: {
    fontSize: 14,
    color: '#6B778C',
    marginTop: 2,
  },
  editButton: {
    marginTop: 8,
  },
  card: {
    marginHorizontal: 16,
    marginBottom: 16,
    elevation: 2,
  },
  reminderInput: {
    width: 80,
    height: 40,
  },
  buildingInput: {
    width: 150,
    height: 40,
  },
  saveButton: {
    marginTop: 16,
  },
  versionContainer: {
    alignItems: 'center',
    marginVertical: 24,
  },
  versionText: {
    fontSize: 14,
    color: '#6B778C',
  },
  dialogInput: {
    marginBottom: 16,
  },
});

export default ProfileScreen;

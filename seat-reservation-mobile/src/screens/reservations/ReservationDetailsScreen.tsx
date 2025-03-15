import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, Card, Button, Divider, ActivityIndicator, useTheme, Dialog, Portal } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { MaterialIcons } from '@expo/vector-icons';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { RootState, AppDispatch } from '../../store';
import { 
  fetchReservationDetails, 
  checkInReservation, 
  checkOutReservation, 
  cancelReservation 
} from '../../store/slices/reservationSlice';
import { MainStackParamList } from '../../navigation/AppNavigator';

type ReservationDetailsRouteProp = RouteProp<MainStackParamList, 'ReservationDetails'>;
type NavigationProp = NativeStackNavigationProp<MainStackParamList>;

const ReservationDetailsScreen = () => {
  const theme = useTheme();
  const route = useRoute<ReservationDetailsRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const dispatch = useDispatch<AppDispatch>();
  
  const [cancelDialogVisible, setCancelDialogVisible] = React.useState(false);
  
  const { id } = route.params;
  const { selectedReservation, isLoading, error } = useSelector(
    (state: RootState) => state.reservations
  );

  useEffect(() => {
    dispatch(fetchReservationDetails(id));
  }, [dispatch, id]);

  const handleCheckIn = async () => {
    try {
      await dispatch(checkInReservation(id)).unwrap();
      Alert.alert('Success', 'You have successfully checked in');
    } catch (error) {
      Alert.alert('Error', 'Failed to check in');
    }
  };

  const handleCheckOut = async () => {
    try {
      await dispatch(checkOutReservation(id)).unwrap();
      Alert.alert('Success', 'You have successfully checked out');
    } catch (error) {
      Alert.alert('Error', 'Failed to check out');
    }
  };

  const handleCancelConfirm = async () => {
    setCancelDialogVisible(false);
    try {
      await dispatch(cancelReservation(id)).unwrap();
      Alert.alert('Success', 'Reservation cancelled successfully', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to cancel reservation');
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator animating={true} size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <Button mode="contained" onPress={() => navigation.goBack()} style={styles.button}>
          Go Back
        </Button>
      </View>
    );
  }

  if (!selectedReservation) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Reservation not found</Text>
        <Button mode="contained" onPress={() => navigation.goBack()} style={styles.button}>
          Go Back
        </Button>
      </View>
    );
  }

  const isUpcoming = new Date(selectedReservation.endTime) > new Date();
  const isPending = selectedReservation.checkInStatus === 'pending';
  const isCheckedIn = selectedReservation.checkInStatus === 'checked-in';

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.title}>Reservation Details</Text>
          
          <View style={styles.statusContainer}>
            <Text style={styles.statusLabel}>Status:</Text>
            <View style={[
              styles.statusBadge,
              {
                backgroundColor: 
                  selectedReservation.status === 'active' ? '#E3F2FD' :
                  selectedReservation.status === 'completed' ? '#E8F5E9' :
                  selectedReservation.status === 'cancelled' ? '#FFEBEE' : '#F5F5F5'
              }
            ]}>
              <Text style={[
                styles.statusText,
                {
                  color: 
                    selectedReservation.status === 'active' ? theme.colors.primary :
                    selectedReservation.status === 'completed' ? theme.colors.secondary :
                    selectedReservation.status === 'cancelled' ? '#FF5630' : '#6B778C'
                }
              ]}>
                {selectedReservation.status === 'active' ? 'Confirmed' :
                 selectedReservation.status === 'completed' ? 'Completed' :
                 selectedReservation.status === 'cancelled' ? 'Cancelled' : selectedReservation.status}
              </Text>
            </View>
          </View>
          
          <Divider style={styles.divider} />
          
          <View style={styles.detailRow}>
            <MaterialIcons name="event" size={20} color={theme.colors.primary} />
            <View style={styles.detailTextContainer}>
              <Text style={styles.detailLabel}>Date</Text>
              <Text style={styles.detailValue}>
                {new Date(selectedReservation.startTime).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </Text>
            </View>
          </View>
          
          <View style={styles.detailRow}>
            <MaterialIcons name="access-time" size={20} color={theme.colors.primary} />
            <View style={styles.detailTextContainer}>
              <Text style={styles.detailLabel}>Time</Text>
              <Text style={styles.detailValue}>
                {new Date(selectedReservation.startTime).toLocaleTimeString('en-US', {
                  hour: 'numeric',
                  minute: '2-digit',
                  hour12: true,
                })}
                {' - '}
                {new Date(selectedReservation.endTime).toLocaleTimeString('en-US', {
                  hour: 'numeric',
                  minute: '2-digit',
                  hour12: true,
                })}
              </Text>
            </View>
          </View>
          
          <View style={styles.detailRow}>
            <MaterialIcons name="location-on" size={20} color={theme.colors.primary} />
            <View style={styles.detailTextContainer}>
              <Text style={styles.detailLabel}>Location</Text>
              <Text style={styles.detailValue}>
                {selectedReservation.space?.name}
              </Text>
              <Text style={styles.detailSubvalue}>
                {selectedReservation.space?.floor}, {selectedReservation.space?.building}
              </Text>
            </View>
          </View>
          
          {selectedReservation.notes && (
            <View style={styles.detailRow}>
              <MaterialIcons name="notes" size={20} color={theme.colors.primary} />
              <View style={styles.detailTextContainer}>
                <Text style={styles.detailLabel}>Notes</Text>
                <Text style={styles.detailValue}>{selectedReservation.notes}</Text>
              </View>
            </View>
          )}
          
          <View style={styles.detailRow}>
            <MaterialIcons name="info" size={20} color={theme.colors.primary} />
            <View style={styles.detailTextContainer}>
              <Text style={styles.detailLabel}>Check-in Status</Text>
              <Text style={[
                styles.detailValue,
                {
                  color: 
                    selectedReservation.checkInStatus === 'checked-in' ? theme.colors.secondary :
                    selectedReservation.checkInStatus === 'checked-out' ? '#6B778C' :
                    theme.colors.primary
                }
              ]}>
                {selectedReservation.checkInStatus === 'pending' ? 'Pending Check-in' :
                 selectedReservation.checkInStatus === 'checked-in' ? 'Checked In' :
                 selectedReservation.checkInStatus === 'checked-out' ? 'Checked Out' : 
                 selectedReservation.checkInStatus}
              </Text>
            </View>
          </View>
        </Card.Content>
      </Card>
      
      {isUpcoming && (
        <Card style={styles.actionsCard}>
          <Card.Content>
            <Text style={styles.actionsTitle}>Actions</Text>
            
            <View style={styles.buttonContainer}>
              {isPending && (
                <Button
                  mode="contained"
                  icon="login"
                  onPress={handleCheckIn}
                  style={[styles.button, styles.checkInButton]}
                >
                  Check In
                </Button>
              )}
              
              {isCheckedIn && (
                <Button
                  mode="contained"
                  icon="logout"
                  onPress={handleCheckOut}
                  style={[styles.button, styles.checkOutButton]}
                >
                  Check Out
                </Button>
              )}
              
              <Button
                mode="outlined"
                icon="map-marker"
                onPress={() => navigation.navigate('FloorPlan')}
                style={styles.button}
              >
                View on Floor Plan
              </Button>
              
              <Button
                mode="outlined"
                icon="cancel"
                onPress={() => setCancelDialogVisible(true)}
                style={[styles.button, styles.cancelButton]}
                textColor="#FF5630"
              >
                Cancel Reservation
              </Button>
            </View>
          </Card.Content>
        </Card>
      )}
      
      <Portal>
        <Dialog visible={cancelDialogVisible} onDismiss={() => setCancelDialogVisible(false)}>
          <Dialog.Title>Cancel Reservation</Dialog.Title>
          <Dialog.Content>
            <Text>Are you sure you want to cancel this reservation? This action cannot be undone.</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setCancelDialogVisible(false)}>No, Keep It</Button>
            <Button onPress={handleCancelConfirm} textColor="#FF5630">Yes, Cancel</Button>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  errorText: {
    color: '#FF5630',
    textAlign: 'center',
    marginBottom: 16,
  },
  card: {
    margin: 16,
    elevation: 2,
  },
  actionsCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    elevation: 2,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  actionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusLabel: {
    fontSize: 16,
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  statusText: {
    fontWeight: '500',
  },
  divider: {
    marginVertical: 16,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  detailTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  detailLabel: {
    fontSize: 14,
    color: '#6B778C',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
  },
  detailSubvalue: {
    fontSize: 14,
    color: '#6B778C',
  },
  buttonContainer: {
    marginTop: 8,
  },
  button: {
    marginBottom: 12,
  },
  checkInButton: {
    backgroundColor: '#0052CC',
  },
  checkOutButton: {
    backgroundColor: '#36B37E',
  },
  cancelButton: {
    borderColor: '#FF5630',
  },
});

export default ReservationDetailsScreen;

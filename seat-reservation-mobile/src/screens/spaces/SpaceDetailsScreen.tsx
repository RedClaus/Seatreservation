import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { 
  Text, 
  Card, 
  Chip, 
  Divider, 
  ActivityIndicator, 
  Button, 
  useTheme,
  Dialog,
  Portal,
  TextInput
} from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { MaterialIcons } from '@expo/vector-icons';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import DateTimePicker from '@react-native-community/datetimepicker';

import { RootState, AppDispatch } from '../../store';
import { fetchSpaceDetails } from '../../store/slices/spaceSlice';
import { createReservation } from '../../store/slices/reservationSlice';
import { MainStackParamList } from '../../navigation/AppNavigator';

type SpaceDetailsRouteProp = RouteProp<MainStackParamList, 'SpaceDetails'>;
type NavigationProp = NativeStackNavigationProp<MainStackParamList>;

const SpaceDetailsScreen = () => {
  const theme = useTheme();
  const route = useRoute<SpaceDetailsRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const dispatch = useDispatch<AppDispatch>();
  
  const { id } = route.params;
  const { selectedSpace, isLoading, error } = useSelector(
    (state: RootState) => state.spaces
  );
  
  const [bookingDialogVisible, setBookingDialogVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date(new Date().setHours(new Date().getHours() + 8)));
  const [notes, setNotes] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [dateTimePickerMode, setDateTimePickerMode] = useState<'date' | 'start' | 'end'>('date');

  useEffect(() => {
    dispatch(fetchSpaceDetails(id));
  }, [dispatch, id]);

  const handleBookNow = () => {
    setBookingDialogVisible(true);
  };

  const handleDatePress = () => {
    setDateTimePickerMode('date');
    setShowDatePicker(true);
  };

  const handleStartTimePress = () => {
    setDateTimePickerMode('start');
    setShowStartTimePicker(true);
  };

  const handleEndTimePress = () => {
    setDateTimePickerMode('end');
    setShowEndTimePicker(true);
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setSelectedDate(selectedDate);
    }
  };

  const handleStartTimeChange = (event: any, selectedTime?: Date) => {
    setShowStartTimePicker(false);
    if (selectedTime) {
      setStartTime(selectedTime);
    }
  };

  const handleEndTimeChange = (event: any, selectedTime?: Date) => {
    setShowEndTimePicker(false);
    if (selectedTime) {
      setEndTime(selectedTime);
    }
  };

  const handleConfirmBooking = async () => {
    if (!selectedSpace) return;
    
    const formattedStartTime = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate(),
      startTime.getHours(),
      startTime.getMinutes()
    ).toISOString();
    
    const formattedEndTime = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate(),
      endTime.getHours(),
      endTime.getMinutes()
    ).toISOString();
    
    try {
      await dispatch(createReservation({
        spaceId: selectedSpace.id,
        startTime: formattedStartTime,
        endTime: formattedEndTime,
        notes: notes.trim() || undefined
      })).unwrap();
      
      setBookingDialogVisible(false);
      Alert.alert(
        'Success',
        'Your reservation has been created successfully',
        [
          { 
            text: 'View My Reservations', 
            onPress: () => navigation.navigate('Reservations') 
          },
          { 
            text: 'OK', 
            style: 'cancel' 
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to create reservation');
    }
  };

  const getSpaceTypeName = (type: string) => {
    switch (type) {
      case 'desk':
        return 'Desk';
      case 'meeting-room':
        return 'Meeting Room';
      case 'phone-booth':
        return 'Phone Booth';
      case 'collaboration-area':
        return 'Collaboration Area';
      default:
        return type;
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

  if (!selectedSpace) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Space not found</Text>
        <Button mode="contained" onPress={() => navigation.goBack()} style={styles.button}>
          Go Back
        </Button>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.headerContainer}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>{selectedSpace.name}</Text>
              <Chip 
                style={[styles.typeChip, { backgroundColor: '#E3F2FD' }]}
                textStyle={{ color: theme.colors.primary }}
              >
                {getSpaceTypeName(selectedSpace.type)}
              </Chip>
            </View>
            
            <View style={styles.statusContainer}>
              <Text style={[styles.statusText, { color: theme.colors.secondary }]}>
                Available
              </Text>
            </View>
          </View>
          
          <Divider style={styles.divider} />
          
          <View style={styles.detailRow}>
            <MaterialIcons name="location-on" size={20} color={theme.colors.primary} />
            <View style={styles.detailTextContainer}>
              <Text style={styles.detailLabel}>Location</Text>
              <Text style={styles.detailValue}>
                {selectedSpace.floor}, {selectedSpace.building}
              </Text>
            </View>
          </View>
          
          <View style={styles.amenitiesContainer}>
            <Text style={styles.sectionTitle}>Amenities</Text>
            <View style={styles.amenitiesList}>
              {selectedSpace.amenities.map((amenity, index) => (
                <Chip 
                  key={index}
                  style={styles.amenityChip}
                  textStyle={{ fontSize: 12 }}
                >
                  {amenity}
                </Chip>
              ))}
            </View>
          </View>
          
          <Divider style={styles.divider} />
          
          <Text style={styles.sectionTitle}>Availability Today</Text>
          {selectedSpace.availability?.today ? (
            <View style={styles.availabilityContainer}>
              {selectedSpace.availability.today.map((slot, index) => (
                <View key={index} style={styles.availabilitySlot}>
                  <View style={[
                    styles.availabilityStatus,
                    { 
                      backgroundColor: 
                        slot.status === 'available' ? theme.colors.secondary : 
                        slot.status === 'reserved' ? '#FFAB00' : '#DFE1E6'
                    }
                  ]} />
                  <Text style={styles.availabilityTime}>
                    {slot.startTime} - {slot.endTime}
                  </Text>
                  <Text style={[
                    styles.availabilityStatusText,
                    { 
                      color: 
                        slot.status === 'available' ? theme.colors.secondary : 
                        slot.status === 'reserved' ? '#FFAB00' : '#6B778C'
                    }
                  ]}>
                    {slot.status.charAt(0).toUpperCase() + slot.status.slice(1)}
                  </Text>
                </View>
              ))}
            </View>
          ) : (
            <Text style={styles.noDataText}>No availability data</Text>
          )}
          
          <Divider style={styles.divider} />
          
          <Text style={styles.sectionTitle}>Next 7 Days Availability</Text>
          {selectedSpace.availability?.nextSevenDays ? (
            <View style={styles.weekAvailabilityContainer}>
              <View style={styles.availabilityStats}>
                <Text style={styles.availabilityStatsText}>
                  Available {selectedSpace.availability.nextSevenDays.availableDays} out of 7 days
                </Text>
                <Text style={styles.availabilityStatsText}>
                  {selectedSpace.availability.nextSevenDays.availablePercentage}% availability
                </Text>
              </View>
              <View style={styles.availabilityBarContainer}>
                <View 
                  style={[
                    styles.availabilityBar, 
                    { width: `${selectedSpace.availability.nextSevenDays.availablePercentage}%` }
                  ]} 
                />
              </View>
            </View>
          ) : (
            <Text style={styles.noDataText}>No availability data</Text>
          )}
        </Card.Content>
      </Card>
      
      <Card style={styles.actionsCard}>
        <Card.Content>
          <Button 
            mode="contained" 
            onPress={handleBookNow}
            style={styles.bookButton}
            icon="calendar-plus"
          >
            Book Now
          </Button>
          <Button 
            mode="outlined" 
            onPress={() => navigation.navigate('FloorPlan')}
            style={styles.floorPlanButton}
            icon="map"
          >
            View on Floor Plan
          </Button>
        </Card.Content>
      </Card>
      
      {/* Date & Time Pickers */}
      {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="default"
          onChange={handleDateChange}
          minimumDate={new Date()}
        />
      )}
      
      {showStartTimePicker && (
        <DateTimePicker
          value={startTime}
          mode="time"
          display="default"
          onChange={handleStartTimeChange}
        />
      )}
      
      {showEndTimePicker && (
        <DateTimePicker
          value={endTime}
          mode="time"
          display="default"
          onChange={handleEndTimeChange}
        />
      )}
      
      {/* Booking Dialog */}
      <Portal>
        <Dialog visible={bookingDialogVisible} onDismiss={() => setBookingDialogVisible(false)}>
          <Dialog.Title>Book {selectedSpace.name}</Dialog.Title>
          <Dialog.Content>
            <View style={styles.dialogRow}>
              <Text style={styles.dialogLabel}>Date:</Text>
              <Button 
                mode="outlined" 
                onPress={handleDatePress}
                style={styles.dialogButton}
              >
                {selectedDate.toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                })}
              </Button>
            </View>
            
            <View style={styles.dialogRow}>
              <Text style={styles.dialogLabel}>Start Time:</Text>
              <Button 
                mode="outlined" 
                onPress={handleStartTimePress}
                style={styles.dialogButton}
              >
                {startTime.toLocaleTimeString('en-US', {
                  hour: 'numeric',
                  minute: '2-digit',
                  hour12: true,
                })}
              </Button>
            </View>
            
            <View style={styles.dialogRow}>
              <Text style={styles.dialogLabel}>End Time:</Text>
              <Button 
                mode="outlined" 
                onPress={handleEndTimePress}
                style={styles.dialogButton}
              >
                {endTime.toLocaleTimeString('en-US', {
                  hour: 'numeric',
                  minute: '2-digit',
                  hour12: true,
                })}
              </Button>
            </View>
            
            <TextInput
              label="Notes (optional)"
              value={notes}
              onChangeText={setNotes}
              mode="outlined"
              multiline
              numberOfLines={3}
              style={styles.notesInput}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setBookingDialogVisible(false)}>Cancel</Button>
            <Button onPress={handleConfirmBooking}>Confirm Booking</Button>
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
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  titleContainer: {
    flex: 1,
    marginRight: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  typeChip: {
    alignSelf: 'flex-start',
  },
  statusContainer: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: '#E8F5E9',
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  amenitiesContainer: {
    marginBottom: 16,
  },
  amenitiesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  amenityChip: {
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: '#F4F5F7',
  },
  availabilityContainer: {
    marginBottom: 16,
  },
  availabilitySlot: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  availabilityStatus: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  availabilityTime: {
    flex: 1,
  },
  availabilityStatusText: {
    fontWeight: '500',
  },
  weekAvailabilityContainer: {
    marginBottom: 16,
  },
  availabilityStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  availabilityStatsText: {
    fontSize: 14,
    color: '#6B778C',
  },
  availabilityBarContainer: {
    height: 8,
    backgroundColor: '#F4F5F7',
    borderRadius: 4,
    overflow: 'hidden',
  },
  availabilityBar: {
    height: '100%',
    backgroundColor: '#36B37E',
    borderRadius: 4,
  },
  noDataText: {
    color: '#6B778C',
    fontStyle: 'italic',
    marginBottom: 16,
  },
  button: {
    marginTop: 16,
  },
  bookButton: {
    marginBottom: 12,
  },
  floorPlanButton: {
    marginBottom: 8,
  },
  dialogRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  dialogLabel: {
    fontSize: 16,
  },
  dialogButton: {
    flex: 1,
    maxWidth: 200,
  },
  notesInput: {
    marginTop: 8,
  },
});

export default SpaceDetailsScreen;

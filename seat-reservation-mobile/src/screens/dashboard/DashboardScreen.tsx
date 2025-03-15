import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, Card, Button, Title, Paragraph, Divider, ActivityIndicator, useTheme } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { RootState, AppDispatch } from '../../store';
import { fetchReservations } from '../../store/slices/reservationSlice';
import { MainStackParamList } from '../../navigation/AppNavigator';

type NavigationProp = NativeStackNavigationProp<MainStackParamList>;

const DashboardScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const dispatch = useDispatch<AppDispatch>();
  
  const { upcomingReservations, isLoading, error } = useSelector(
    (state: RootState) => state.reservations
  );
  
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(fetchReservations());
  }, [dispatch]);

  // Mock team locations data
  const teamLocations = [
    {
      id: '1',
      name: 'John Doe',
      location: 'Desk A-124, 3rd Floor, Headquarters',
    },
    {
      id: '2',
      name: 'Jane Smith',
      location: 'Meeting Room B-101, 4th Floor, Headquarters',
    },
    {
      id: '3',
      name: 'Bob Johnson',
      location: 'Working Remotely',
    },
  ];

  const handleReservationPress = (id: string) => {
    navigation.navigate('ReservationDetails', { id });
  };

  const handleBookWorkspace = () => {
    navigation.navigate('Spaces');
  };

  const handleViewReservations = () => {
    navigation.navigate('Reservations');
  };

  const handleViewFloorPlan = () => {
    navigation.navigate('FloorPlan');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Hello, {user?.name || 'User'}</Text>
        <Text style={styles.date}>
          {new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </Text>
      </View>

      {/* Quick Actions */}
      <Card style={styles.card}>
        <Card.Content>
          <Title>Quick Actions</Title>
          <View style={styles.quickActions}>
            <TouchableOpacity
              style={styles.quickAction}
              onPress={handleBookWorkspace}
            >
              <View style={[styles.iconContainer, { backgroundColor: theme.colors.primary }]}>
                <MaterialIcons name="add" size={24} color="#fff" />
              </View>
              <Text style={styles.quickActionText}>Book Workspace</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickAction}
              onPress={handleViewReservations}
            >
              <View style={[styles.iconContainer, { backgroundColor: theme.colors.secondary }]}>
                <MaterialIcons name="event" size={24} color="#fff" />
              </View>
              <Text style={styles.quickActionText}>My Reservations</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickAction}
              onPress={handleViewFloorPlan}
            >
              <View style={[styles.iconContainer, { backgroundColor: '#FFAB00' }]}>
                <MaterialIcons name="map" size={24} color="#fff" />
              </View>
              <Text style={styles.quickActionText}>Floor Plans</Text>
            </TouchableOpacity>
          </View>
        </Card.Content>
      </Card>

      {/* Upcoming Reservations */}
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.sectionHeader}>
            <Title>Upcoming Reservations</Title>
            <Button
              mode="text"
              onPress={handleViewReservations}
              labelStyle={{ fontSize: 12 }}
            >
              View All
            </Button>
          </View>

          {isLoading ? (
            <ActivityIndicator animating={true} style={styles.loader} />
          ) : error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : upcomingReservations.length > 0 ? (
            upcomingReservations.slice(0, 2).map((reservation) => (
              <TouchableOpacity
                key={reservation.id}
                onPress={() => handleReservationPress(reservation.id)}
              >
                <Card style={styles.reservationCard} mode="outlined">
                  <Card.Content>
                    <View style={styles.reservationHeader}>
                      <View>
                        <Text style={styles.reservationDate}>
                          {new Date(reservation.startTime).toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </Text>
                        <Text style={styles.reservationTime}>
                          {new Date(reservation.startTime).toLocaleTimeString('en-US', {
                            hour: 'numeric',
                            minute: '2-digit',
                            hour12: true,
                          })}
                          {' - '}
                          {new Date(reservation.endTime).toLocaleTimeString('en-US', {
                            hour: 'numeric',
                            minute: '2-digit',
                            hour12: true,
                          })}
                        </Text>
                      </View>
                      <View style={styles.statusContainer}>
                        <Text
                          style={[
                            styles.statusText,
                            {
                              color:
                                reservation.checkInStatus === 'checked-in'
                                  ? theme.colors.secondary
                                  : theme.colors.primary,
                            },
                          ]}
                        >
                          {reservation.checkInStatus === 'checked-in'
                            ? 'Checked In'
                            : 'Pending Check-in'}
                        </Text>
                      </View>
                    </View>
                    <Divider style={styles.divider} />
                    <View style={styles.locationContainer}>
                      <MaterialIcons name="location-on" size={16} color={theme.colors.primary} />
                      <Text style={styles.locationText}>
                        {reservation.space?.name}, {reservation.space?.floor}, {reservation.space?.building}
                      </Text>
                    </View>
                  </Card.Content>
                </Card>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.emptyText}>No upcoming reservations</Text>
          )}
        </Card.Content>
      </Card>

      {/* Team Locations */}
      <Card style={styles.card}>
        <Card.Content>
          <Title>Team Locations Today</Title>
          {teamLocations.map((member) => (
            <View key={member.id} style={styles.teamMember}>
              <Text style={styles.memberName}>{member.name}</Text>
              <Text style={styles.memberLocation}>{member.location}</Text>
              <Divider style={styles.divider} />
            </View>
          ))}
        </Card.Content>
      </Card>

      {/* Space Utilization */}
      <Card style={[styles.card, styles.lastCard]}>
        <Card.Content>
          <View style={styles.sectionHeader}>
            <Title>Space Utilization</Title>
            <MaterialIcons name="trending-up" size={24} color={theme.colors.primary} />
          </View>
          <Paragraph style={styles.utilizationText}>
            Current headquarters utilization: 65% (325/500 spaces occupied)
          </Paragraph>
          <Text style={styles.peakHoursText}>Peak hours: 10:00 AM - 2:00 PM</Text>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 16,
    paddingTop: 24,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  date: {
    fontSize: 14,
    color: '#6B778C',
    marginTop: 4,
  },
  card: {
    marginHorizontal: 16,
    marginBottom: 16,
    elevation: 2,
  },
  lastCard: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  quickAction: {
    alignItems: 'center',
    width: '30%',
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 12,
    textAlign: 'center',
  },
  reservationCard: {
    marginTop: 12,
    backgroundColor: '#fff',
  },
  reservationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  reservationDate: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  reservationTime: {
    fontSize: 14,
    color: '#6B778C',
  },
  statusContainer: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    backgroundColor: '#F4F5F7',
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  divider: {
    marginVertical: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 14,
    color: '#6B778C',
    marginLeft: 4,
    flex: 1,
  },
  teamMember: {
    marginVertical: 8,
  },
  memberName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  memberLocation: {
    fontSize: 14,
    color: '#6B778C',
    marginTop: 4,
  },
  utilizationText: {
    fontSize: 16,
    marginTop: 8,
  },
  peakHoursText: {
    fontSize: 14,
    color: '#6B778C',
    marginTop: 8,
  },
  loader: {
    marginVertical: 20,
  },
  errorText: {
    color: '#FF5630',
    marginVertical: 16,
    textAlign: 'center',
  },
  emptyText: {
    textAlign: 'center',
    marginVertical: 16,
    color: '#6B778C',
  },
});

export default DashboardScreen;

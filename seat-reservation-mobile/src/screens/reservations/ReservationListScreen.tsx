import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Text, Card, Chip, Divider, ActivityIndicator, Button, Searchbar, useTheme } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { RootState, AppDispatch } from '../../store';
import { fetchReservations, selectReservation } from '../../store/slices/reservationSlice';
import { MainStackParamList } from '../../navigation/AppNavigator';

type NavigationProp = NativeStackNavigationProp<MainStackParamList>;

const ReservationListScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const dispatch = useDispatch<AppDispatch>();
  
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [searchQuery, setSearchQuery] = useState('');
  
  const { upcomingReservations, pastReservations, isLoading, error } = useSelector(
    (state: RootState) => state.reservations
  );

  useEffect(() => {
    dispatch(fetchReservations());
  }, [dispatch]);

  const handleReservationPress = (id: string) => {
    dispatch(selectReservation(id));
    navigation.navigate('ReservationDetails', { id });
  };

  const getStatusChip = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <Chip
            icon={() => <MaterialIcons name="check-circle" size={16} color={theme.colors.primary} />}
            style={[styles.statusChip, { backgroundColor: '#E3F2FD' }]}
            textStyle={{ color: theme.colors.primary }}
          >
            Confirmed
          </Chip>
        );
      case 'pending':
        return (
          <Chip
            icon={() => <MaterialIcons name="warning" size={16} color="#FFAB00" />}
            style={[styles.statusChip, { backgroundColor: '#FFF8E1' }]}
            textStyle={{ color: '#FFAB00' }}
          >
            Pending
          </Chip>
        );
      case 'completed':
        return (
          <Chip
            icon={() => <MaterialIcons name="check-circle" size={16} color={theme.colors.secondary} />}
            style={[styles.statusChip, { backgroundColor: '#E8F5E9' }]}
            textStyle={{ color: theme.colors.secondary }}
          >
            Completed
          </Chip>
        );
      case 'cancelled':
        return (
          <Chip
            icon={() => <MaterialIcons name="cancel" size={16} color="#FF5630" />}
            style={[styles.statusChip, { backgroundColor: '#FFEBEE' }]}
            textStyle={{ color: '#FF5630' }}
          >
            Cancelled
          </Chip>
        );
      default:
        return (
          <Chip style={styles.statusChip}>
            {status}
          </Chip>
        );
    }
  };

  const renderReservationItem = ({ item }: { item: any }) => {
    return (
      <TouchableOpacity onPress={() => handleReservationPress(item.id)}>
        <Card style={styles.card} mode="outlined">
          <Card.Content>
            <View style={styles.cardHeader}>
              <View>
                <Text style={styles.dateText}>
                  {new Date(item.startTime).toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                  })}
                </Text>
                <Text style={styles.timeText}>
                  {new Date(item.startTime).toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true,
                  })}
                  {' - '}
                  {new Date(item.endTime).toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true,
                  })}
                </Text>
              </View>
              {getStatusChip(item.status)}
            </View>
            
            <Divider style={styles.divider} />
            
            <View style={styles.locationContainer}>
              <MaterialIcons name="location-on" size={16} color={theme.colors.primary} />
              <Text style={styles.locationText}>
                {item.space?.name}, {item.space?.floor}, {item.space?.building}
              </Text>
            </View>
            
            {item.checkInStatus === 'pending' && activeTab === 'upcoming' && (
              <View style={styles.actionsContainer}>
                <Button
                  mode="contained"
                  compact
                  style={styles.checkInButton}
                  labelStyle={styles.buttonLabel}
                >
                  Check In
                </Button>
                <Button
                  mode="outlined"
                  compact
                  style={styles.cancelButton}
                  labelStyle={[styles.buttonLabel, { color: '#FF5630' }]}
                >
                  Cancel
                </Button>
              </View>
            )}
          </Card.Content>
        </Card>
      </TouchableOpacity>
    );
  };

  const filteredUpcomingReservations = upcomingReservations.filter(
    (reservation) => {
      if (!searchQuery) return true;
      
      const spaceInfo = `${reservation.space?.name} ${reservation.space?.floor} ${reservation.space?.building}`.toLowerCase();
      return spaceInfo.includes(searchQuery.toLowerCase());
    }
  );

  const filteredPastReservations = pastReservations.filter(
    (reservation) => {
      if (!searchQuery) return true;
      
      const spaceInfo = `${reservation.space?.name} ${reservation.space?.floor} ${reservation.space?.building}`.toLowerCase();
      return spaceInfo.includes(searchQuery.toLowerCase());
    }
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Reservations</Text>
        <Searchbar
          placeholder="Search reservations"
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
          iconColor={theme.colors.primary}
        />
        
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === 'upcoming' && { borderBottomColor: theme.colors.primary }
            ]}
            onPress={() => setActiveTab('upcoming')}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'upcoming' && { color: theme.colors.primary }
              ]}
            >
              Upcoming
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === 'past' && { borderBottomColor: theme.colors.primary }
            ]}
            onPress={() => setActiveTab('past')}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'past' && { color: theme.colors.primary }
              ]}
            >
              Past
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {isLoading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator animating={true} size="large" color={theme.colors.primary} />
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : (
        <FlatList
          data={activeTab === 'upcoming' ? filteredUpcomingReservations : filteredPastReservations}
          renderItem={renderReservationItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <MaterialIcons name="event-busy" size={64} color="#DFE1E6" />
              <Text style={styles.emptyText}>
                {activeTab === 'upcoming'
                  ? 'No upcoming reservations'
                  : 'No past reservations'}
              </Text>
              {activeTab === 'upcoming' && (
                <Button
                  mode="contained"
                  onPress={() => navigation.navigate('Spaces')}
                  style={styles.bookButton}
                >
                  Book a Workspace
                </Button>
              )}
            </View>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 0,
    elevation: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  searchBar: {
    marginBottom: 16,
    elevation: 0,
    backgroundColor: '#f5f5f5',
  },
  tabContainer: {
    flexDirection: 'row',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6B778C',
  },
  listContent: {
    padding: 16,
  },
  card: {
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  dateText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  timeText: {
    fontSize: 14,
    color: '#6B778C',
  },
  statusChip: {
    height: 28,
  },
  divider: {
    marginVertical: 12,
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
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
  },
  checkInButton: {
    marginRight: 8,
  },
  cancelButton: {
    borderColor: '#FF5630',
  },
  buttonLabel: {
    fontSize: 12,
  },
  loaderContainer: {
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
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    color: '#6B778C',
    marginTop: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
  bookButton: {
    paddingHorizontal: 16,
  },
});

export default ReservationListScreen;

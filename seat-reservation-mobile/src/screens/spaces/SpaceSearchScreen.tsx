import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { 
  Text, 
  Card, 
  Chip, 
  Divider, 
  ActivityIndicator, 
  Button, 
  Searchbar, 
  useTheme,
  TextInput,
  Menu,
  IconButton
} from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import DateTimePicker from '@react-native-community/datetimepicker';

import { RootState, AppDispatch } from '../../store';
import { 
  fetchBuildings, 
  fetchAvailableSpaces, 
  selectSpace 
} from '../../store/slices/spaceSlice';
import { MainStackParamList } from '../../navigation/AppNavigator';

type NavigationProp = NativeStackNavigationProp<MainStackParamList>;

const SpaceSearchScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const dispatch = useDispatch<AppDispatch>();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date(new Date().setHours(new Date().getHours() + 8)));
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [buildingMenuVisible, setBuildingMenuVisible] = useState(false);
  const [spaceTypeMenuVisible, setSpaceTypeMenuVisible] = useState(false);
  const [selectedBuilding, setSelectedBuilding] = useState<string | null>(null);
  const [selectedSpaceType, setSelectedSpaceType] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  
  const { buildings, availableSpaces, isLoading, error } = useSelector(
    (state: RootState) => state.spaces
  );

  useEffect(() => {
    dispatch(fetchBuildings());
  }, [dispatch]);

  const handleSearch = () => {
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
    
    dispatch(fetchAvailableSpaces({
      startTime: formattedStartTime,
      endTime: formattedEndTime,
      buildingId: selectedBuilding || undefined,
      spaceType: selectedSpaceType || undefined
    }));
    
    setHasSearched(true);
  };

  const handleSpacePress = (id: string) => {
    dispatch(selectSpace(id));
    navigation.navigate('SpaceDetails', { id });
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

  const getSelectedBuildingName = () => {
    if (!selectedBuilding) return 'Any Building';
    const building = buildings.find(b => b.id === selectedBuilding);
    return building ? building.name : 'Any Building';
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

  const getSelectedSpaceTypeName = () => {
    if (!selectedSpaceType) return 'Any Space Type';
    return getSpaceTypeName(selectedSpaceType);
  };

  const renderSpaceItem = ({ item }: { item: any }) => {
    return (
      <TouchableOpacity onPress={() => handleSpacePress(item.id)}>
        <Card style={styles.card} mode="outlined">
          <Card.Content>
            <View style={styles.cardHeader}>
              <Text style={styles.spaceName}>{item.name}</Text>
              <Chip 
                style={[styles.typeChip, { backgroundColor: '#E3F2FD' }]}
                textStyle={{ color: theme.colors.primary }}
              >
                {getSpaceTypeName(item.type)}
              </Chip>
            </View>
            
            <View style={styles.locationContainer}>
              <MaterialIcons name="location-on" size={16} color={theme.colors.primary} />
              <Text style={styles.locationText}>
                {item.floor}, {item.building}
              </Text>
            </View>
            
            <Divider style={styles.divider} />
            
            <View style={styles.amenitiesContainer}>
              <Text style={styles.amenitiesTitle}>Amenities:</Text>
              <View style={styles.amenitiesList}>
                {item.amenities.map((amenity: string, index: number) => (
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
            
            <View style={styles.availabilityContainer}>
              <MaterialIcons name="access-time" size={16} color={theme.colors.secondary} />
              <Text style={[styles.availabilityText, { color: theme.colors.secondary }]}>
                Available: {new Date(item.availability.startTime).toLocaleTimeString('en-US', {
                  hour: 'numeric',
                  minute: '2-digit',
                  hour12: true,
                })} - {new Date(item.availability.endTime).toLocaleTimeString('en-US', {
                  hour: 'numeric',
                  minute: '2-digit',
                  hour12: true,
                })}
              </Text>
            </View>
          </Card.Content>
          <Card.Actions>
            <Button mode="contained" onPress={() => handleSpacePress(item.id)}>
              Book Now
            </Button>
          </Card.Actions>
        </Card>
      </TouchableOpacity>
    );
  };

  const filteredSpaces = availableSpaces.filter(
    (space) => {
      if (!searchQuery) return true;
      
      const spaceInfo = `${space.name} ${space.floor} ${space.building}`.toLowerCase();
      return spaceInfo.includes(searchQuery.toLowerCase());
    }
  );

  return (
    <View style={styles.container}>
      <ScrollView style={styles.searchContainer}>
        <Text style={styles.title}>Find a Space</Text>
        
        <Card style={styles.filterCard}>
          <Card.Content>
            <View style={styles.dateTimeContainer}>
              <TouchableOpacity 
                style={styles.datePickerButton} 
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={styles.dateTimeLabel}>Date</Text>
                <View style={styles.dateTimeValue}>
                  <MaterialIcons name="event" size={20} color={theme.colors.primary} style={styles.dateTimeIcon} />
                  <Text>
                    {selectedDate.toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </Text>
                </View>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.timePickerButton} 
                onPress={() => setShowStartTimePicker(true)}
              >
                <Text style={styles.dateTimeLabel}>Start Time</Text>
                <View style={styles.dateTimeValue}>
                  <MaterialIcons name="access-time" size={20} color={theme.colors.primary} style={styles.dateTimeIcon} />
                  <Text>
                    {startTime.toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true,
                    })}
                  </Text>
                </View>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.timePickerButton} 
                onPress={() => setShowEndTimePicker(true)}
              >
                <Text style={styles.dateTimeLabel}>End Time</Text>
                <View style={styles.dateTimeValue}>
                  <MaterialIcons name="access-time" size={20} color={theme.colors.primary} style={styles.dateTimeIcon} />
                  <Text>
                    {endTime.toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true,
                    })}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
            
            <View style={styles.filterRow}>
              <View style={styles.menuContainer}>
                <Text style={styles.filterLabel}>Building</Text>
                <Menu
                  visible={buildingMenuVisible}
                  onDismiss={() => setBuildingMenuVisible(false)}
                  anchor={
                    <TouchableOpacity 
                      style={styles.menuButton}
                      onPress={() => setBuildingMenuVisible(true)}
                    >
                      <Text numberOfLines={1} style={styles.menuButtonText}>
                        {getSelectedBuildingName()}
                      </Text>
                      <MaterialIcons name="arrow-drop-down" size={24} color="#6B778C" />
                    </TouchableOpacity>
                  }
                >
                  <Menu.Item 
                    onPress={() => {
                      setSelectedBuilding(null);
                      setBuildingMenuVisible(false);
                    }} 
                    title="Any Building" 
                  />
                  <Divider />
                  {buildings.map((building) => (
                    <Menu.Item
                      key={building.id}
                      onPress={() => {
                        setSelectedBuilding(building.id);
                        setBuildingMenuVisible(false);
                      }}
                      title={building.name}
                    />
                  ))}
                </Menu>
              </View>
              
              <View style={styles.menuContainer}>
                <Text style={styles.filterLabel}>Space Type</Text>
                <Menu
                  visible={spaceTypeMenuVisible}
                  onDismiss={() => setSpaceTypeMenuVisible(false)}
                  anchor={
                    <TouchableOpacity 
                      style={styles.menuButton}
                      onPress={() => setSpaceTypeMenuVisible(true)}
                    >
                      <Text numberOfLines={1} style={styles.menuButtonText}>
                        {getSelectedSpaceTypeName()}
                      </Text>
                      <MaterialIcons name="arrow-drop-down" size={24} color="#6B778C" />
                    </TouchableOpacity>
                  }
                >
                  <Menu.Item 
                    onPress={() => {
                      setSelectedSpaceType(null);
                      setSpaceTypeMenuVisible(false);
                    }} 
                    title="Any Space Type" 
                  />
                  <Divider />
                  <Menu.Item
                    onPress={() => {
                      setSelectedSpaceType('desk');
                      setSpaceTypeMenuVisible(false);
                    }}
                    title="Desk"
                  />
                  <Menu.Item
                    onPress={() => {
                      setSelectedSpaceType('meeting-room');
                      setSpaceTypeMenuVisible(false);
                    }}
                    title="Meeting Room"
                  />
                  <Menu.Item
                    onPress={() => {
                      setSelectedSpaceType('phone-booth');
                      setSpaceTypeMenuVisible(false);
                    }}
                    title="Phone Booth"
                  />
                  <Menu.Item
                    onPress={() => {
                      setSelectedSpaceType('collaboration-area');
                      setSpaceTypeMenuVisible(false);
                    }}
                    title="Collaboration Area"
                  />
                </Menu>
              </View>
            </View>
            
            <Button 
              mode="contained" 
              onPress={handleSearch}
              style={styles.searchButton}
              icon="magnify"
            >
              Search
            </Button>
          </Card.Content>
        </Card>
      </ScrollView>
      
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
      
      {hasSearched && (
        <View style={styles.resultsContainer}>
          <View style={styles.resultsHeader}>
            <Text style={styles.resultsTitle}>Available Spaces</Text>
            <Searchbar
              placeholder="Search results"
              onChangeText={setSearchQuery}
              value={searchQuery}
              style={styles.searchBar}
              iconColor={theme.colors.primary}
            />
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
              data={filteredSpaces}
              renderItem={renderSpaceItem}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.listContent}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <MaterialIcons name="search-off" size={64} color="#DFE1E6" />
                  <Text style={styles.emptyText}>
                    No spaces available matching your criteria
                  </Text>
                  <Text style={styles.emptySubtext}>
                    Try adjusting your search parameters
                  </Text>
                </View>
              }
            />
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  searchContainer: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  filterCard: {
    marginBottom: 16,
    elevation: 2,
  },
  dateTimeContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  datePickerButton: {
    flex: 1,
    marginRight: 8,
  },
  timePickerButton: {
    flex: 1,
    marginLeft: 8,
  },
  dateTimeLabel: {
    fontSize: 12,
    color: '#6B778C',
    marginBottom: 4,
  },
  dateTimeValue: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DFE1E6',
    borderRadius: 4,
    padding: 8,
  },
  dateTimeIcon: {
    marginRight: 8,
  },
  filterRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  menuContainer: {
    flex: 1,
    marginHorizontal: 4,
  },
  filterLabel: {
    fontSize: 12,
    color: '#6B778C',
    marginBottom: 4,
  },
  menuButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#DFE1E6',
    borderRadius: 4,
    padding: 8,
  },
  menuButtonText: {
    flex: 1,
  },
  searchButton: {
    marginTop: 8,
  },
  resultsContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  resultsHeader: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#DFE1E6',
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  searchBar: {
    elevation: 0,
    backgroundColor: '#f5f5f5',
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
    marginBottom: 8,
  },
  spaceName: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 8,
  },
  typeChip: {
    height: 28,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationText: {
    fontSize: 14,
    color: '#6B778C',
    marginLeft: 4,
    flex: 1,
  },
  divider: {
    marginVertical: 12,
  },
  amenitiesContainer: {
    marginBottom: 12,
  },
  amenitiesTitle: {
    fontSize: 14,
    marginBottom: 8,
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
    flexDirection: 'row',
    alignItems: 'center',
  },
  availabilityText: {
    fontSize: 14,
    marginLeft: 4,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
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
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#6B778C',
    marginTop: 8,
    textAlign: 'center',
  },
});

export default SpaceSearchScreen;

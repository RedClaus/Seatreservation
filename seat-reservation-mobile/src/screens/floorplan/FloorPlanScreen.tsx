import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Dimensions, TouchableOpacity, Alert } from 'react-native';
import { 
  Text, 
  Card, 
  Chip, 
  Divider, 
  ActivityIndicator, 
  Button, 
  useTheme,
  Menu,
  Portal,
  Dialog
} from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Svg, { Rect, Text as SvgText, G, Line, Circle } from 'react-native-svg';
import { PanGestureHandler, PinchGestureHandler, State } from 'react-native-gesture-handler';
import Animated, { 
  useAnimatedGestureHandler, 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring 
} from 'react-native-reanimated';

import { RootState, AppDispatch } from '../../store';
import { 
  fetchBuildings, 
  fetchFloors, 
  fetchSpaces, 
  selectBuilding, 
  selectFloor, 
  selectSpace 
} from '../../store/slices/spaceSlice';
import { MainStackParamList } from '../../navigation/AppNavigator';

type NavigationProp = NativeStackNavigationProp<MainStackParamList>;

const { width } = Dimensions.get('window');

const FloorPlanScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const dispatch = useDispatch<AppDispatch>();
  
  const [buildingMenuVisible, setBuildingMenuVisible] = useState(false);
  const [floorMenuVisible, setFloorMenuVisible] = useState(false);
  const [selectedSpaceId, setSelectedSpaceId] = useState<string | null>(null);
  const [spaceDetailsVisible, setSpaceDetailsVisible] = useState(false);
  
  const { 
    buildings, 
    floors, 
    spaces, 
    selectedBuilding, 
    selectedFloor, 
    isLoading, 
    error 
  } = useSelector((state: RootState) => state.spaces);

  // Gesture handlers for pan and zoom
  const scale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  
  const pinchHandler = useAnimatedGestureHandler({
    onActive: (event) => {
      scale.value = Math.max(0.5, Math.min(event.scale, 3));
    },
    onEnd: () => {
      if (scale.value < 0.5) {
        scale.value = withSpring(0.5);
      } else if (scale.value > 3) {
        scale.value = withSpring(3);
      }
    },
  });
  
  const panHandler = useAnimatedGestureHandler({
    onStart: (_, ctx: any) => {
      ctx.startX = translateX.value;
      ctx.startY = translateY.value;
    },
    onActive: (event, ctx) => {
      translateX.value = ctx.startX + event.translationX;
      translateY.value = ctx.startY + event.translationY;
    },
  });
  
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { scale: scale.value },
      ],
    };
  });

  useEffect(() => {
    dispatch(fetchBuildings());
  }, [dispatch]);

  useEffect(() => {
    if (selectedBuilding) {
      dispatch(fetchFloors(selectedBuilding.id));
    }
  }, [dispatch, selectedBuilding]);

  useEffect(() => {
    if (selectedFloor) {
      dispatch(fetchSpaces(selectedFloor.id));
    }
  }, [dispatch, selectedFloor]);

  const handleBuildingSelect = (id: string) => {
    dispatch(selectBuilding(id));
    setBuildingMenuVisible(false);
  };

  const handleFloorSelect = (id: string) => {
    dispatch(selectFloor(id));
    setFloorMenuVisible(false);
  };

  const handleSpacePress = (id: string) => {
    setSelectedSpaceId(id);
    setSpaceDetailsVisible(true);
  };

  const handleViewSpaceDetails = () => {
    if (selectedSpaceId) {
      dispatch(selectSpace(selectedSpaceId));
      setSpaceDetailsVisible(false);
      navigation.navigate('SpaceDetails', { id: selectedSpaceId });
    }
  };

  const getSpaceColor = (status: string) => {
    switch (status) {
      case 'available':
        return '#4CAF50'; // Green
      case 'occupied':
        return '#F44336'; // Red
      case 'reserved':
        return '#FFC107'; // Amber
      default:
        return '#9E9E9E'; // Grey
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

  const getSelectedSpace = () => {
    return spaces.find(space => space.id === selectedSpaceId);
  };

  const renderFloorPlan = () => {
    if (!selectedFloor) return null;
    
    // In a real app, this would use the actual floor plan data
    // For now, we'll create a simple grid layout
    const planWidth = 1200;
    const planHeight = 800;
    
    return (
      <PinchGestureHandler
        onGestureEvent={pinchHandler}
        onHandlerStateChange={pinchHandler}
      >
        <Animated.View>
          <PanGestureHandler
            onGestureEvent={panHandler}
            onHandlerStateChange={panHandler}
          >
            <Animated.View style={[styles.floorPlanContainer, animatedStyle]}>
              <Svg width={planWidth} height={planHeight} viewBox={`0 0 ${planWidth} ${planHeight}`}>
                {/* Background */}
                <Rect x="0" y="0" width={planWidth} height={planHeight} fill="#f5f5f5" />
                
                {/* Grid */}
                <G>
                  {Array.from({ length: planWidth / 50 + 1 }).map((_, i) => (
                    <Line
                      key={`v-${i}`}
                      x1={i * 50}
                      y1={0}
                      x2={i * 50}
                      y2={planHeight}
                      stroke="#e0e0e0"
                      strokeWidth="1"
                    />
                  ))}
                  {Array.from({ length: planHeight / 50 + 1 }).map((_, i) => (
                    <Line
                      key={`h-${i}`}
                      x1={0}
                      y1={i * 50}
                      x2={planWidth}
                      y2={i * 50}
                      stroke="#e0e0e0"
                      strokeWidth="1"
                    />
                  ))}
                </G>
                
                {/* Walls */}
                <Rect x="50" y="50" width="1100" height="700" fill="none" stroke="#424242" strokeWidth="4" />
                
                {/* Rooms and areas */}
                <Rect x="50" y="50" width="1100" height="50" fill="#e0e0e0" stroke="#424242" strokeWidth="2" />
                <SvgText x="600" y="80" textAnchor="middle" fill="#424242" fontSize="20">Reception Area</SvgText>
                
                {/* Spaces */}
                {spaces.map((space) => {
                  // In a real app, these would be the actual coordinates from the floor plan
                  // For now, we'll use the mock data
                  return (
                    <G
                      key={space.id}
                      onPress={() => handleSpacePress(space.id)}
                    >
                      <Rect
                        x={space.coordinates?.x || 0}
                        y={space.coordinates?.y || 0}
                        width={space.type === 'meeting-room' ? 80 : 40}
                        height={space.type === 'meeting-room' ? 60 : 30}
                        fill={getSpaceColor(space.status)}
                        stroke={selectedSpaceId === space.id ? '#000000' : '#757575'}
                        strokeWidth={selectedSpaceId === space.id ? 2 : 1}
                      />
                      <SvgText
                        x={(space.coordinates?.x || 0) + (space.type === 'meeting-room' ? 40 : 20)}
                        y={(space.coordinates?.y || 0) + (space.type === 'meeting-room' ? 30 : 15)}
                        textAnchor="middle"
                        fill="#ffffff"
                        fontSize="10"
                      >
                        {space.name}
                      </SvgText>
                    </G>
                  );
                })}
              </Svg>
            </Animated.View>
          </PanGestureHandler>
        </Animated.View>
      </PinchGestureHandler>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Floor Plan</Text>
        
        <View style={styles.selectors}>
          <Menu
            visible={buildingMenuVisible}
            onDismiss={() => setBuildingMenuVisible(false)}
            anchor={
              <Button 
                mode="outlined" 
                onPress={() => setBuildingMenuVisible(true)}
                style={styles.selectorButton}
              >
                {selectedBuilding ? selectedBuilding.name : 'Select Building'}
              </Button>
            }
          >
            {buildings.map((building) => (
              <Menu.Item
                key={building.id}
                onPress={() => handleBuildingSelect(building.id)}
                title={building.name}
              />
            ))}
          </Menu>
          
          <Menu
            visible={floorMenuVisible}
            onDismiss={() => setFloorMenuVisible(false)}
            anchor={
              <Button 
                mode="outlined" 
                onPress={() => setFloorMenuVisible(true)}
                style={styles.selectorButton}
                disabled={!selectedBuilding}
              >
                {selectedFloor ? selectedFloor.name : 'Select Floor'}
              </Button>
            }
          >
            {floors.map((floor) => (
              <Menu.Item
                key={floor.id}
                onPress={() => handleFloorSelect(floor.id)}
                title={floor.name}
              />
            ))}
          </Menu>
        </View>
      </View>
      
      <View style={styles.content}>
        {isLoading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator animating={true} size="large" color={theme.colors.primary} />
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : !selectedBuilding ? (
          <View style={styles.placeholderContainer}>
            <MaterialIcons name="business" size={64} color="#DFE1E6" />
            <Text style={styles.placeholderText}>
              Select a building to view floor plans
            </Text>
          </View>
        ) : !selectedFloor ? (
          <View style={styles.placeholderContainer}>
            <MaterialIcons name="layers" size={64} color="#DFE1E6" />
            <Text style={styles.placeholderText}>
              Select a floor to view the floor plan
            </Text>
          </View>
        ) : (
          <ScrollView 
            style={styles.floorPlanScrollView}
            contentContainerStyle={styles.floorPlanContent}
            maximumZoomScale={3}
            minimumZoomScale={0.5}
          >
            {renderFloorPlan()}
          </ScrollView>
        )}
      </View>
      
      <View style={styles.legend}>
        <Text style={styles.legendTitle}>Legend</Text>
        <View style={styles.legendItems}>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: '#4CAF50' }]} />
            <Text style={styles.legendText}>Available</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: '#F44336' }]} />
            <Text style={styles.legendText}>Occupied</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: '#FFC107' }]} />
            <Text style={styles.legendText}>Reserved</Text>
          </View>
        </View>
      </View>
      
      <Portal>
        <Dialog visible={spaceDetailsVisible} onDismiss={() => setSpaceDetailsVisible(false)}>
          {getSelectedSpace() && (
            <>
              <Dialog.Title>{getSelectedSpace()?.name}</Dialog.Title>
              <Dialog.Content>
                <View style={styles.dialogContent}>
                  <Chip 
                    style={[styles.typeChip, { backgroundColor: '#E3F2FD', marginBottom: 16 }]}
                    textStyle={{ color: theme.colors.primary }}
                  >
                    {getSpaceTypeName(getSelectedSpace()?.type || '')}
                  </Chip>
                  
                  <View style={styles.dialogRow}>
                    <MaterialIcons name="location-on" size={20} color={theme.colors.primary} />
                    <Text style={styles.dialogText}>
                      {getSelectedSpace()?.floor}, {getSelectedSpace()?.building}
                    </Text>
                  </View>
                  
                  <View style={styles.dialogRow}>
                    <MaterialIcons name="info" size={20} color={theme.colors.primary} />
                    <Text style={styles.dialogText}>
                      Status: {getSelectedSpace()?.status}
                    </Text>
                  </View>
                </View>
              </Dialog.Content>
              <Dialog.Actions>
                <Button onPress={() => setSpaceDetailsVisible(false)}>Close</Button>
                <Button onPress={handleViewSpaceDetails}>View Details</Button>
              </Dialog.Actions>
            </>
          )}
        </Dialog>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#DFE1E6',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  selectors: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  selectorButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  content: {
    flex: 1,
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
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  placeholderText: {
    fontSize: 16,
    color: '#6B778C',
    marginTop: 16,
    textAlign: 'center',
  },
  floorPlanScrollView: {
    flex: 1,
  },
  floorPlanContent: {
    padding: 16,
  },
  floorPlanContainer: {
    width: width - 32,
    height: width - 32,
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 2,
  },
  legend: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#DFE1E6',
  },
  legendTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  legendItems: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 8,
  },
  legendText: {
    fontSize: 14,
  },
  dialogContent: {
    marginBottom: 8,
  },
  typeChip: {
    alignSelf: 'flex-start',
  },
  dialogRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  dialogText: {
    marginLeft: 8,
    fontSize: 16,
  },
});

export default FloorPlanScreen;

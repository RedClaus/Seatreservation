import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { apiService } from '../../services/api';

interface Space {
  id: string;
  name: string;
  type: string;
  floor: string;
  building: string;
  status: string;
  amenities: string[];
  availability?: {
    startTime: string;
    endTime: string;
  };
}

interface Building {
  id: string;
  name: string;
  address: string;
  region: string;
  country: string;
  city: string;
  timezone: string;
  status: string;
  floors: number;
  totalSpaces: number;
  amenities: string[];
}

interface Floor {
  id: string;
  buildingId: string;
  name: string;
  level: number;
  capacity: number;
  spaceTypes: Record<string, number>;
  status: string;
  floorPlanUrl: string;
}

interface SpaceState {
  buildings: Building[];
  floors: Floor[];
  spaces: Space[];
  availableSpaces: Space[];
  selectedBuilding: Building | null;
  selectedFloor: Floor | null;
  selectedSpace: Space | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: SpaceState = {
  buildings: [],
  floors: [],
  spaces: [],
  availableSpaces: [],
  selectedBuilding: null,
  selectedFloor: null,
  selectedSpace: null,
  isLoading: false,
  error: null,
};

export const fetchBuildings = createAsyncThunk(
  'spaces/fetchBuildings',
  async (_, { rejectWithValue }) => {
    try {
      // In a real app, this would make an API call
      // For now, we'll use mock data
      const buildings = [
        {
          id: 'building123',
          name: 'Headquarters',
          address: '123 Main St, San Francisco, CA 94105',
          region: 'North America',
          country: 'USA',
          city: 'San Francisco',
          timezone: 'America/Los_Angeles',
          status: 'active',
          floors: 10,
          totalSpaces: 500,
          amenities: ['cafeteria', 'gym', 'parking'],
        },
        {
          id: 'building456',
          name: 'Downtown Office',
          address: '456 Market St, San Francisco, CA 94105',
          region: 'North America',
          country: 'USA',
          city: 'San Francisco',
          timezone: 'America/Los_Angeles',
          status: 'active',
          floors: 5,
          totalSpaces: 200,
          amenities: ['cafeteria', 'parking'],
        },
        {
          id: 'building789',
          name: 'Tech Campus',
          address: '789 Tech Blvd, San Jose, CA 95110',
          region: 'North America',
          country: 'USA',
          city: 'San Jose',
          timezone: 'America/Los_Angeles',
          status: 'active',
          floors: 3,
          totalSpaces: 150,
          amenities: ['cafeteria', 'gym', 'parking', 'game-room'],
        },
      ];
      
      return buildings;
    } catch (error) {
      return rejectWithValue('Failed to fetch buildings');
    }
  }
);

export const fetchFloors = createAsyncThunk(
  'spaces/fetchFloors',
  async (buildingId: string, { rejectWithValue }) => {
    try {
      // In a real app, this would make an API call
      // For now, we'll use mock data
      const floors = [
        {
          id: 'floor123',
          buildingId,
          name: '3rd Floor',
          level: 3,
          capacity: 120,
          spaceTypes: {
            desk: 80,
            'meeting-room': 10,
            'phone-booth': 5,
            'collaboration-area': 3,
          },
          status: 'active',
          floorPlanUrl: 'https://storage.company.com/floorplans/building123-floor3.svg',
        },
        {
          id: 'floor124',
          buildingId,
          name: '4th Floor',
          level: 4,
          capacity: 100,
          spaceTypes: {
            desk: 70,
            'meeting-room': 8,
            'phone-booth': 4,
            'collaboration-area': 2,
          },
          status: 'active',
          floorPlanUrl: 'https://storage.company.com/floorplans/building123-floor4.svg',
        },
        {
          id: 'floor125',
          buildingId,
          name: '5th Floor',
          level: 5,
          capacity: 80,
          spaceTypes: {
            desk: 60,
            'meeting-room': 6,
            'phone-booth': 3,
            'collaboration-area': 1,
          },
          status: 'active',
          floorPlanUrl: 'https://storage.company.com/floorplans/building123-floor5.svg',
        },
      ];
      
      return floors;
    } catch (error) {
      return rejectWithValue('Failed to fetch floors');
    }
  }
);

export const fetchSpaces = createAsyncThunk(
  'spaces/fetchSpaces',
  async (floorId: string, { rejectWithValue }) => {
    try {
      // In a real app, this would make an API call
      // For now, we'll use mock data
      const spaces = [
        {
          id: 'space456',
          floorId,
          name: 'Desk A-123',
          type: 'desk',
          floor: '3rd Floor',
          building: 'Headquarters',
          status: 'active',
          amenities: ['monitor', 'docking-station', 'adjustable-height'],
        },
        {
          id: 'space789',
          floorId,
          name: 'Meeting Room B-101',
          type: 'meeting-room',
          floor: '3rd Floor',
          building: 'Headquarters',
          status: 'active',
          amenities: ['video-conference', 'whiteboard', 'tv-screen'],
        },
        {
          id: 'space101',
          floorId,
          name: 'Phone Booth C-105',
          type: 'phone-booth',
          floor: '3rd Floor',
          building: 'Headquarters',
          status: 'active',
          amenities: ['sound-insulation', 'small-desk'],
        },
      ];
      
      return spaces;
    } catch (error) {
      return rejectWithValue('Failed to fetch spaces');
    }
  }
);

export const fetchAvailableSpaces = createAsyncThunk(
  'spaces/fetchAvailableSpaces',
  async (
    params: {
      startTime: string;
      endTime: string;
      buildingId?: string;
      floorId?: string;
      spaceType?: string;
      amenities?: string[];
    },
    { rejectWithValue }
  ) => {
    try {
      // In a real app, this would make an API call
      // For now, we'll use mock data
      const spaces = [
        {
          id: 'space456',
          name: 'Desk A-123',
          type: 'desk',
          floor: '3rd Floor',
          building: 'Headquarters',
          status: 'available',
          amenities: ['monitor', 'docking-station', 'adjustable-height'],
          availability: {
            startTime: params.startTime,
            endTime: params.endTime,
          },
        },
        {
          id: 'space789',
          name: 'Meeting Room B-101',
          type: 'meeting-room',
          floor: '4th Floor',
          building: 'Headquarters',
          status: 'available',
          amenities: ['video-conference', 'whiteboard', 'tv-screen'],
          availability: {
            startTime: params.startTime,
            endTime: params.endTime,
          },
        },
        {
          id: 'space101',
          name: 'Phone Booth C-105',
          type: 'phone-booth',
          floor: '5th Floor',
          building: 'Headquarters',
          status: 'available',
          amenities: ['sound-insulation', 'small-desk'],
          availability: {
            startTime: params.startTime,
            endTime: params.endTime,
          },
        },
      ];
      
      // Filter by space type if provided
      let filteredSpaces = spaces;
      if (params.spaceType) {
        filteredSpaces = filteredSpaces.filter(space => space.type === params.spaceType);
      }
      
      return filteredSpaces;
    } catch (error) {
      return rejectWithValue('Failed to fetch available spaces');
    }
  }
);

export const fetchSpaceDetails = createAsyncThunk(
  'spaces/fetchSpaceDetails',
  async (id: string, { rejectWithValue }) => {
    try {
      // In a real app, this would make an API call
      // For now, we'll use mock data
      const space = {
        id,
        name: 'Desk A-123',
        type: 'desk',
        floor: '3rd Floor',
        building: 'Headquarters',
        status: 'active',
        amenities: ['monitor', 'docking-station', 'adjustable-height'],
        availability: {
          today: [
            {
              startTime: '09:00',
              endTime: '12:00',
              status: 'reserved',
            },
            {
              startTime: '12:00',
              endTime: '17:00',
              status: 'available',
            },
          ],
          nextSevenDays: {
            availableDays: 5,
            availablePercentage: 71,
          },
        },
      };
      
      return space;
    } catch (error) {
      return rejectWithValue('Failed to fetch space details');
    }
  }
);

const spaceSlice = createSlice({
  name: 'spaces',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    selectBuilding: (state, action: PayloadAction<string>) => {
      const building = state.buildings.find(b => b.id === action.payload) || null;
      state.selectedBuilding = building;
      state.selectedFloor = null;
      state.selectedSpace = null;
    },
    selectFloor: (state, action: PayloadAction<string>) => {
      const floor = state.floors.find(f => f.id === action.payload) || null;
      state.selectedFloor = floor;
      state.selectedSpace = null;
    },
    selectSpace: (state, action: PayloadAction<string>) => {
      const space = 
        state.spaces.find(s => s.id === action.payload) ||
        state.availableSpaces.find(s => s.id === action.payload) ||
        null;
      state.selectedSpace = space;
    },
    clearSelections: (state) => {
      state.selectedBuilding = null;
      state.selectedFloor = null;
      state.selectedSpace = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch buildings
      .addCase(fetchBuildings.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBuildings.fulfilled, (state, action) => {
        state.isLoading = false;
        state.buildings = action.payload;
      })
      .addCase(fetchBuildings.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Fetch floors
      .addCase(fetchFloors.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFloors.fulfilled, (state, action) => {
        state.isLoading = false;
        state.floors = action.payload;
      })
      .addCase(fetchFloors.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Fetch spaces
      .addCase(fetchSpaces.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSpaces.fulfilled, (state, action) => {
        state.isLoading = false;
        state.spaces = action.payload;
      })
      .addCase(fetchSpaces.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Fetch available spaces
      .addCase(fetchAvailableSpaces.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAvailableSpaces.fulfilled, (state, action) => {
        state.isLoading = false;
        state.availableSpaces = action.payload;
      })
      .addCase(fetchAvailableSpaces.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Fetch space details
      .addCase(fetchSpaceDetails.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSpaceDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedSpace = action.payload;
      })
      .addCase(fetchSpaceDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, selectBuilding, selectFloor, selectSpace, clearSelections } = spaceSlice.actions;
export default spaceSlice.reducer;

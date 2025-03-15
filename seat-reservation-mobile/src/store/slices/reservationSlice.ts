import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { apiService } from '../../services/api';

interface Reservation {
  id: string;
  spaceId: string;
  userId: string;
  startTime: string;
  endTime: string;
  status: string;
  checkInStatus: string;
  notes?: string;
  space?: {
    id: string;
    name: string;
    type: string;
    floor: string;
    building: string;
  };
}

interface ReservationState {
  upcomingReservations: Reservation[];
  pastReservations: Reservation[];
  selectedReservation: Reservation | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: ReservationState = {
  upcomingReservations: [],
  pastReservations: [],
  selectedReservation: null,
  isLoading: false,
  error: null,
};

export const fetchReservations = createAsyncThunk(
  'reservations/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      // In a real app, this would make an API call
      // For now, we'll use mock data
      
      // Mock upcoming reservations
      const upcomingReservations = [
        {
          id: '1',
          spaceId: 'space456',
          userId: 'user789',
          startTime: '2025-03-15T09:00:00Z',
          endTime: '2025-03-15T17:00:00Z',
          status: 'active',
          checkInStatus: 'pending',
          space: {
            id: 'space456',
            name: 'Desk A-123',
            type: 'desk',
            floor: '3rd Floor',
            building: 'Headquarters',
          },
        },
        {
          id: '2',
          spaceId: 'space789',
          userId: 'user789',
          startTime: '2025-03-16T10:00:00Z',
          endTime: '2025-03-16T16:00:00Z',
          status: 'active',
          checkInStatus: 'pending',
          space: {
            id: 'space789',
            name: 'Meeting Room B-101',
            type: 'meeting-room',
            floor: '4th Floor',
            building: 'Headquarters',
          },
        },
      ];
      
      // Mock past reservations
      const pastReservations = [
        {
          id: '3',
          spaceId: 'space456',
          userId: 'user789',
          startTime: '2025-03-10T09:00:00Z',
          endTime: '2025-03-10T17:00:00Z',
          status: 'completed',
          checkInStatus: 'checked-out',
          space: {
            id: 'space456',
            name: 'Desk A-123',
            type: 'desk',
            floor: '3rd Floor',
            building: 'Headquarters',
          },
        },
        {
          id: '4',
          spaceId: 'space101',
          userId: 'user789',
          startTime: '2025-03-05T13:00:00Z',
          endTime: '2025-03-05T15:00:00Z',
          status: 'completed',
          checkInStatus: 'checked-out',
          space: {
            id: 'space101',
            name: 'Phone Booth C-105',
            type: 'phone-booth',
            floor: '5th Floor',
            building: 'Headquarters',
          },
        },
      ];
      
      return { upcomingReservations, pastReservations };
    } catch (error) {
      return rejectWithValue('Failed to fetch reservations');
    }
  }
);

export const fetchReservationDetails = createAsyncThunk(
  'reservations/fetchDetails',
  async (id: string, { rejectWithValue }) => {
    try {
      // In a real app, this would make an API call
      // For now, we'll use mock data
      const reservation = {
        id,
        spaceId: 'space456',
        userId: 'user789',
        startTime: '2025-03-15T09:00:00Z',
        endTime: '2025-03-15T17:00:00Z',
        status: 'active',
        checkInStatus: 'pending',
        notes: 'Client meeting in the morning',
        space: {
          id: 'space456',
          name: 'Desk A-123',
          type: 'desk',
          floor: '3rd Floor',
          building: 'Headquarters',
        },
      };
      
      return reservation;
    } catch (error) {
      return rejectWithValue('Failed to fetch reservation details');
    }
  }
);

export const createReservation = createAsyncThunk(
  'reservations/create',
  async (data: any, { rejectWithValue }) => {
    try {
      // In a real app, this would make an API call
      // For now, we'll simulate a successful creation
      const newReservation = {
        id: Math.random().toString(36).substring(7),
        ...data,
        status: 'active',
        checkInStatus: 'pending',
      };
      
      return newReservation;
    } catch (error) {
      return rejectWithValue('Failed to create reservation');
    }
  }
);

export const cancelReservation = createAsyncThunk(
  'reservations/cancel',
  async (id: string, { rejectWithValue }) => {
    try {
      // In a real app, this would make an API call
      // For now, we'll simulate a successful cancellation
      return id;
    } catch (error) {
      return rejectWithValue('Failed to cancel reservation');
    }
  }
);

export const checkInReservation = createAsyncThunk(
  'reservations/checkIn',
  async (id: string, { rejectWithValue }) => {
    try {
      // In a real app, this would make an API call
      // For now, we'll simulate a successful check-in
      return {
        id,
        checkInStatus: 'checked-in',
        checkInTime: new Date().toISOString(),
      };
    } catch (error) {
      return rejectWithValue('Failed to check in');
    }
  }
);

export const checkOutReservation = createAsyncThunk(
  'reservations/checkOut',
  async (id: string, { rejectWithValue }) => {
    try {
      // In a real app, this would make an API call
      // For now, we'll simulate a successful check-out
      return {
        id,
        checkInStatus: 'checked-out',
        checkOutTime: new Date().toISOString(),
      };
    } catch (error) {
      return rejectWithValue('Failed to check out');
    }
  }
);

const reservationSlice = createSlice({
  name: 'reservations',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    selectReservation: (state, action: PayloadAction<string>) => {
      const reservation = 
        state.upcomingReservations.find(r => r.id === action.payload) ||
        state.pastReservations.find(r => r.id === action.payload) ||
        null;
      
      state.selectedReservation = reservation;
    },
    clearSelectedReservation: (state) => {
      state.selectedReservation = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch reservations
      .addCase(fetchReservations.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchReservations.fulfilled, (state, action) => {
        state.isLoading = false;
        state.upcomingReservations = action.payload.upcomingReservations;
        state.pastReservations = action.payload.pastReservations;
      })
      .addCase(fetchReservations.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Fetch reservation details
      .addCase(fetchReservationDetails.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchReservationDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedReservation = action.payload;
      })
      .addCase(fetchReservationDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Create reservation
      .addCase(createReservation.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createReservation.fulfilled, (state, action) => {
        state.isLoading = false;
        state.upcomingReservations.push(action.payload);
      })
      .addCase(createReservation.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Cancel reservation
      .addCase(cancelReservation.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(cancelReservation.fulfilled, (state, action) => {
        state.isLoading = false;
        state.upcomingReservations = state.upcomingReservations.filter(
          (reservation) => reservation.id !== action.payload
        );
        if (state.selectedReservation?.id === action.payload) {
          state.selectedReservation = null;
        }
      })
      .addCase(cancelReservation.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Check in
      .addCase(checkInReservation.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(checkInReservation.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.upcomingReservations.findIndex(
          (reservation) => reservation.id === action.payload.id
        );
        if (index !== -1) {
          state.upcomingReservations[index].checkInStatus = action.payload.checkInStatus;
        }
        if (state.selectedReservation?.id === action.payload.id) {
          state.selectedReservation.checkInStatus = action.payload.checkInStatus;
        }
      })
      .addCase(checkInReservation.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Check out
      .addCase(checkOutReservation.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(checkOutReservation.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.upcomingReservations.findIndex(
          (reservation) => reservation.id === action.payload.id
        );
        if (index !== -1) {
          state.upcomingReservations[index].checkInStatus = action.payload.checkInStatus;
        }
        if (state.selectedReservation?.id === action.payload.id) {
          state.selectedReservation.checkInStatus = action.payload.checkInStatus;
        }
      })
      .addCase(checkOutReservation.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, selectReservation, clearSelectedReservation } = reservationSlice.actions;
export default reservationSlice.reducer;

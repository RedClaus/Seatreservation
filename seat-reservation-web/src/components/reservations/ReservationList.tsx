import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Tabs, 
  Tab, 
  Card, 
  CardContent, 
  CardActions, 
  Button, 
  Chip, 
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material';
import { LocationOn, AccessTime, CheckCircle, Cancel, Warning } from '@mui/icons-material';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`reservations-tabpanel-${index}`}
      aria-labelledby={`reservations-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const ReservationList: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<string | null>(null);

  // Mock data for reservations
  const upcomingReservations = [
    {
      id: '1',
      date: 'Today',
      time: '9:00 AM - 5:00 PM',
      location: 'Desk A-123, 3rd Floor, Headquarters',
      status: 'Confirmed',
      type: 'desk'
    },
    {
      id: '2',
      date: 'Tomorrow',
      time: '10:00 AM - 4:00 PM',
      location: 'Meeting Room B-101, 4th Floor, Headquarters',
      status: 'Pending Check-in',
      type: 'meeting-room'
    },
    {
      id: '3',
      date: 'Mar 20, 2025',
      time: '9:00 AM - 5:00 PM',
      location: 'Desk A-123, 3rd Floor, Headquarters',
      status: 'Confirmed',
      type: 'desk'
    }
  ];

  const pastReservations = [
    {
      id: '4',
      date: 'Mar 10, 2025',
      time: '9:00 AM - 5:00 PM',
      location: 'Desk A-123, 3rd Floor, Headquarters',
      status: 'Completed',
      type: 'desk'
    },
    {
      id: '5',
      date: 'Mar 5, 2025',
      time: '1:00 PM - 3:00 PM',
      location: 'Phone Booth C-105, 5th Floor, Headquarters',
      status: 'Completed',
      type: 'phone-booth'
    },
    {
      id: '6',
      date: 'Mar 1, 2025',
      time: '9:00 AM - 5:00 PM',
      location: 'Desk B-234, 4th Floor, Downtown Office',
      status: 'No-show',
      type: 'desk'
    }
  ];

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleCancelClick = (id: string) => {
    setSelectedReservation(id);
    setCancelDialogOpen(true);
  };

  const handleCancelConfirm = () => {
    // In a real application, this would make an API call to cancel the reservation
    console.log(`Cancelling reservation ${selectedReservation}`);
    setCancelDialogOpen(false);
    // Would update the state here in a real application
  };

  const handleCancelDialogClose = () => {
    setCancelDialogOpen(false);
  };

  const getStatusChip = (status: string) => {
    switch (status) {
      case 'Confirmed':
        return <Chip icon={<CheckCircle />} label={status} color="primary" size="small" />;
      case 'Pending Check-in':
        return <Chip icon={<Warning />} label={status} color="warning" size="small" />;
      case 'Completed':
        return <Chip icon={<CheckCircle />} label={status} color="success" size="small" />;
      case 'No-show':
        return <Chip icon={<Cancel />} label={status} color="error" size="small" />;
      default:
        return <Chip label={status} size="small" />;
    }
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        My Reservations
      </Typography>

      <Paper elevation={2}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          centered
        >
          <Tab label="Upcoming" />
          <Tab label="Past" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          {upcomingReservations.length > 0 ? (
            upcomingReservations.map((reservation) => (
              <Card key={reservation.id} sx={{ mb: 2 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box>
                      <Typography variant="h6" gutterBottom>
                        {reservation.date}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <AccessTime fontSize="small" sx={{ mr: 0.5 }} color="action" />
                        <Typography variant="body2" color="text.secondary">
                          {reservation.time}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <LocationOn fontSize="small" sx={{ mr: 0.5 }} color="action" />
                        <Typography variant="body2" color="text.secondary">
                          {reservation.location}
                        </Typography>
                      </Box>
                    </Box>
                    <Box>
                      {getStatusChip(reservation.status)}
                    </Box>
                  </Box>
                </CardContent>
                <Divider />
                <CardActions>
                  {reservation.status === 'Pending Check-in' && (
                    <Button size="small" color="primary">
                      Check In
                    </Button>
                  )}
                  <Button size="small">
                    Modify
                  </Button>
                  <Button size="small" color="error" onClick={() => handleCancelClick(reservation.id)}>
                    Cancel
                  </Button>
                </CardActions>
              </Card>
            ))
          ) : (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h6" color="text.secondary">
                No upcoming reservations
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Book a workspace to see your reservations here.
              </Typography>
            </Box>
          )}
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          {pastReservations.length > 0 ? (
            pastReservations.map((reservation) => (
              <Card key={reservation.id} sx={{ mb: 2 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box>
                      <Typography variant="h6" gutterBottom>
                        {reservation.date}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <AccessTime fontSize="small" sx={{ mr: 0.5 }} color="action" />
                        <Typography variant="body2" color="text.secondary">
                          {reservation.time}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <LocationOn fontSize="small" sx={{ mr: 0.5 }} color="action" />
                        <Typography variant="body2" color="text.secondary">
                          {reservation.location}
                        </Typography>
                      </Box>
                    </Box>
                    <Box>
                      {getStatusChip(reservation.status)}
                    </Box>
                  </Box>
                </CardContent>
                <Divider />
                <CardActions>
                  <Button size="small">
                    Book Again
                  </Button>
                </CardActions>
              </Card>
            ))
          ) : (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h6" color="text.secondary">
                No past reservations
              </Typography>
            </Box>
          )}
        </TabPanel>
      </Paper>

      {/* Cancel Confirmation Dialog */}
      <Dialog
        open={cancelDialogOpen}
        onClose={handleCancelDialogClose}
      >
        <DialogTitle>Cancel Reservation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to cancel this reservation? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDialogClose}>No, Keep It</Button>
          <Button onClick={handleCancelConfirm} color="error" autoFocus>
            Yes, Cancel Reservation
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ReservationList;

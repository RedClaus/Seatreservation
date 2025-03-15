import React from 'react';
import { Grid, Paper, Typography, Box, Button, Card, CardContent, CardActions, Divider } from '@mui/material';
import { Add, Event, People, Room, TrendingUp } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  // Mock data for upcoming reservations
  const upcomingReservations = [
    {
      id: '1',
      date: 'Today',
      time: '9:00 AM - 5:00 PM',
      location: 'Desk A-123, 3rd Floor, Headquarters',
      status: 'Confirmed'
    },
    {
      id: '2',
      date: 'Tomorrow',
      time: '10:00 AM - 4:00 PM',
      location: 'Meeting Room B-101, 4th Floor, Headquarters',
      status: 'Pending Check-in'
    }
  ];

  // Mock data for team locations
  const teamLocations = [
    {
      id: '1',
      name: 'John Doe',
      location: 'Desk A-124, 3rd Floor, Headquarters'
    },
    {
      id: '2',
      name: 'Jane Smith',
      location: 'Meeting Room B-101, 4th Floor, Headquarters'
    },
    {
      id: '3',
      name: 'Bob Johnson',
      location: 'Working Remotely'
    }
  ];

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Dashboard
      </Typography>

      {/* Quick Actions */}
      <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Quick Actions
        </Typography>
        <Grid container spacing={2}>
          <Grid item>
            <Button 
              variant="contained" 
              startIcon={<Add />}
              onClick={() => navigate('/spaces')}
            >
              Book a Workspace
            </Button>
          </Grid>
          <Grid item>
            <Button 
              variant="outlined" 
              startIcon={<Event />}
              onClick={() => navigate('/reservations')}
            >
              View My Reservations
            </Button>
          </Grid>
          <Grid item>
            <Button 
              variant="outlined" 
              startIcon={<People />}
            >
              Find a Colleague
            </Button>
          </Grid>
          <Grid item>
            <Button 
              variant="outlined" 
              startIcon={<Room />}
              onClick={() => navigate('/floorplans')}
            >
              View Floor Plans
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Grid container spacing={3}>
        {/* Upcoming Reservations */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Upcoming Reservations
              </Typography>
              <Button 
                size="small" 
                onClick={() => navigate('/reservations')}
              >
                View All
              </Button>
            </Box>
            {upcomingReservations.map((reservation) => (
              <Card key={reservation.id} sx={{ mb: 2 }}>
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>
                    {reservation.date} • {reservation.time}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {reservation.location}
                  </Typography>
                  <Typography variant="body2" color="primary">
                    {reservation.status}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small">Check In</Button>
                  <Button size="small">Modify</Button>
                  <Button size="small" color="error">Cancel</Button>
                </CardActions>
              </Card>
            ))}
          </Paper>
        </Grid>

        {/* Team Locations */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Team Locations Today
            </Typography>
            {teamLocations.map((member) => (
              <Box key={member.id} sx={{ mb: 2 }}>
                <Typography variant="subtitle1">
                  {member.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {member.location}
                </Typography>
                <Divider sx={{ mt: 1 }} />
              </Box>
            ))}
          </Paper>
        </Grid>

        {/* Space Utilization */}
        <Grid item xs={12}>
          <Paper elevation={2} sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <TrendingUp sx={{ mr: 1 }} color="primary" />
              <Typography variant="h6">
                Space Utilization
              </Typography>
            </Box>
            <Typography variant="body1" paragraph>
              Current headquarters utilization: 65% (325/500 spaces occupied)
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Peak hours: 10:00 AM - 2:00 PM
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;

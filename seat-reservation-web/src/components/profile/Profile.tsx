import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  TextField, 
  Button, 
  Avatar, 
  Divider, 
  FormControl, 
  FormControlLabel, 
  Switch, 
  Chip,
  Alert
} from '@mui/material';
import { Save, Edit } from '@mui/icons-material';

const Profile: React.FC = () => {
  const [editing, setEditing] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  // Mock user data
  const [userData, setUserData] = useState({
    name: 'John Doe',
    email: 'john.doe@company.com',
    department: 'Marketing',
    title: 'Marketing Specialist',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco',
    preferences: {
      defaultBuilding: 'Headquarters',
      emailNotifications: true,
      pushNotifications: true,
      reminderTime: 30
    }
  });

  const handleEditToggle = () => {
    setEditing(!editing);
    setSuccessMessage('');
  };

  const handleSave = () => {
    // In a real application, this would make an API call to update the user profile
    setEditing(false);
    setSuccessMessage('Profile updated successfully!');
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value
    });
  };

  const handlePreferenceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked, value } = e.target;
    
    if (name === 'reminderTime') {
      setUserData({
        ...userData,
        preferences: {
          ...userData.preferences,
          [name]: parseInt(value)
        }
      });
    } else {
      setUserData({
        ...userData,
        preferences: {
          ...userData.preferences,
          [name]: checked
        }
      });
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          My Profile
        </Typography>
        <Button 
          variant={editing ? "outlined" : "contained"} 
          startIcon={editing ? <Save /> : <Edit />}
          onClick={editing ? handleSave : handleEditToggle}
        >
          {editing ? "Save Changes" : "Edit Profile"}
        </Button>
      </Box>

      {successMessage && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {successMessage}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Personal Information */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Avatar 
                sx={{ width: 80, height: 80, mr: 2 }}
                alt={userData.name}
                src="/static/images/avatar/1.jpg"
              />
              <Box>
                <Typography variant="h5">{userData.name}</Typography>
                <Typography variant="body1" color="text.secondary">
                  {userData.title}, {userData.department}
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ mb: 3 }} />

            <Typography variant="h6" gutterBottom>
              Personal Information
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Full Name"
                  name="name"
                  value={userData.name}
                  onChange={handleInputChange}
                  disabled={!editing}
                  variant={editing ? "outlined" : "filled"}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  value={userData.email}
                  onChange={handleInputChange}
                  disabled={!editing}
                  variant={editing ? "outlined" : "filled"}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Department"
                  name="department"
                  value={userData.department}
                  onChange={handleInputChange}
                  disabled={!editing}
                  variant={editing ? "outlined" : "filled"}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Title"
                  name="title"
                  value={userData.title}
                  onChange={handleInputChange}
                  disabled={!editing}
                  variant={editing ? "outlined" : "filled"}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone"
                  name="phone"
                  value={userData.phone}
                  onChange={handleInputChange}
                  disabled={!editing}
                  variant={editing ? "outlined" : "filled"}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Location"
                  name="location"
                  value={userData.location}
                  onChange={handleInputChange}
                  disabled={!editing}
                  variant={editing ? "outlined" : "filled"}
                  margin="normal"
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Preferences */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Preferences
            </Typography>

            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Default Building
              </Typography>
              <Chip 
                label={userData.preferences.defaultBuilding} 
                color="primary" 
                variant="outlined" 
              />
              {editing && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  You can change your default building in the settings
                </Typography>
              )}
            </Box>

            <Divider sx={{ mb: 3 }} />

            <Typography variant="subtitle1" gutterBottom>
              Notifications
            </Typography>

            <FormControl component="fieldset" sx={{ width: '100%' }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={userData.preferences.emailNotifications}
                    onChange={handlePreferenceChange}
                    name="emailNotifications"
                    disabled={!editing}
                  />
                }
                label="Email Notifications"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={userData.preferences.pushNotifications}
                    onChange={handlePreferenceChange}
                    name="pushNotifications"
                    disabled={!editing}
                  />
                }
                label="Push Notifications"
              />
            </FormControl>

            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Reminder Time
              </Typography>
              <TextField
                select
                fullWidth
                name="reminderTime"
                value={userData.preferences.reminderTime}
                onChange={handlePreferenceChange}
                disabled={!editing}
                variant={editing ? "outlined" : "filled"}
                SelectProps={{
                  native: true,
                }}
              >
                <option value={15}>15 minutes before</option>
                <option value={30}>30 minutes before</option>
                <option value={60}>1 hour before</option>
                <option value={120}>2 hours before</option>
                <option value={1440}>1 day before</option>
              </TextField>
            </Box>
          </Paper>

          <Paper elevation={2} sx={{ p: 3, mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Account Security
            </Typography>
            <Button variant="outlined" fullWidth sx={{ mb: 2 }}>
              Change Password
            </Button>
            <Button variant="outlined" fullWidth>
              Two-Factor Authentication
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Profile;

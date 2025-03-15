import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  TextField, 
  Button, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Card, 
  CardContent, 
  CardActions, 
  CardMedia, 
  Chip,
  SelectChangeEvent
} from '@mui/material';
import { Search, LocationOn, AccessTime } from '@mui/icons-material';

const SpaceSearch: React.FC = () => {
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [building, setBuilding] = useState('');
  const [spaceType, setSpaceType] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searched, setSearched] = useState(false);

  // Mock data for buildings
  const buildings = [
    { id: '1', name: 'Headquarters' },
    { id: '2', name: 'Downtown Office' },
    { id: '3', name: 'Tech Campus' }
  ];

  // Mock data for space types
  const spaceTypes = [
    { id: 'desk', name: 'Desk' },
    { id: 'meeting-room', name: 'Meeting Room' },
    { id: 'phone-booth', name: 'Phone Booth' },
    { id: 'collaboration-area', name: 'Collaboration Area' }
  ];

  // Mock data for search results
  const mockSearchResults = [
    {
      id: '1',
      name: 'Desk A-123',
      type: 'desk',
      building: 'Headquarters',
      floor: '3rd Floor',
      amenities: ['Monitor', 'Docking Station', 'Adjustable Height'],
      availability: '9:00 AM - 5:00 PM',
      image: 'https://via.placeholder.com/300x200?text=Desk+A-123'
    },
    {
      id: '2',
      name: 'Meeting Room B-101',
      type: 'meeting-room',
      building: 'Headquarters',
      floor: '4th Floor',
      amenities: ['Video Conference', 'Whiteboard', 'TV Screen'],
      availability: '9:00 AM - 5:00 PM',
      image: 'https://via.placeholder.com/300x200?text=Meeting+Room+B-101'
    },
    {
      id: '3',
      name: 'Phone Booth C-105',
      type: 'phone-booth',
      building: 'Headquarters',
      floor: '5th Floor',
      amenities: ['Sound Insulation', 'Small Desk'],
      availability: '9:00 AM - 5:00 PM',
      image: 'https://via.placeholder.com/300x200?text=Phone+Booth+C-105'
    }
  ];

  const handleBuildingChange = (event: SelectChangeEvent) => {
    setBuilding(event.target.value);
  };

  const handleSpaceTypeChange = (event: SelectChangeEvent) => {
    setSpaceType(event.target.value);
  };

  const handleSearch = () => {
    // In a real application, this would make an API call to search for spaces
    // For now, we'll just use our mock data
    setSearchResults(mockSearchResults.filter(space => {
      if (spaceType && space.type !== spaceType) return false;
      return true;
    }));
    setSearched(true);
  };

  const handleBookSpace = (spaceId: string) => {
    // In a real application, this would navigate to a booking form or open a modal
    console.log(`Booking space ${spaceId}`);
    alert(`Space ${spaceId} booked successfully!`);
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Find a Space
      </Typography>

      {/* Search Form */}
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel id="building-label">Building</InputLabel>
              <Select
                labelId="building-label"
                id="building-select"
                value={building}
                label="Building"
                onChange={handleBuildingChange}
              >
                <MenuItem value="">
                  <em>Any</em>
                </MenuItem>
                {buildings.map((building) => (
                  <MenuItem key={building.id} value={building.id}>
                    {building.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel id="space-type-label">Space Type</InputLabel>
              <Select
                labelId="space-type-label"
                id="space-type-select"
                value={spaceType}
                label="Space Type"
                onChange={handleSpaceTypeChange}
              >
                <MenuItem value="">
                  <em>Any</em>
                </MenuItem>
                {spaceTypes.map((type) => (
                  <MenuItem key={type.id} value={type.id}>
                    {type.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3} sx={{ display: 'flex', alignItems: 'center' }}>
            <Button 
              variant="contained" 
              fullWidth 
              startIcon={<Search />}
              onClick={handleSearch}
              sx={{ height: '56px' }}
            >
              Search
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Search Results */}
      {searched && (
        <>
          <Typography variant="h5" gutterBottom>
            Available Spaces
          </Typography>
          <Grid container spacing={3}>
            {searchResults.length > 0 ? (
              searchResults.map((space) => (
                <Grid item xs={12} md={4} key={space.id}>
                  <Card>
                    <CardMedia
                      component="img"
                      height="140"
                      image={space.image}
                      alt={space.name}
                    />
                    <CardContent>
                      <Typography variant="h6" component="div">
                        {space.name}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <LocationOn fontSize="small" sx={{ mr: 0.5 }} color="action" />
                        <Typography variant="body2" color="text.secondary">
                          {space.building}, {space.floor}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <AccessTime fontSize="small" sx={{ mr: 0.5 }} color="action" />
                        <Typography variant="body2" color="text.secondary">
                          Available: {space.availability}
                        </Typography>
                      </Box>
                      <Box sx={{ mt: 2 }}>
                        {space.amenities.map((amenity: string, index: number) => (
                          <Chip 
                            key={index} 
                            label={amenity} 
                            size="small" 
                            sx={{ mr: 0.5, mb: 0.5 }} 
                          />
                        ))}
                      </Box>
                    </CardContent>
                    <CardActions>
                      <Button 
                        size="small" 
                        variant="contained" 
                        fullWidth
                        onClick={() => handleBookSpace(space.id)}
                      >
                        Book Now
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))
            ) : (
              <Grid item xs={12}>
                <Paper elevation={0} sx={{ p: 3, textAlign: 'center' }}>
                  <Typography variant="h6" color="text.secondary">
                    No spaces available matching your criteria.
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Try adjusting your search parameters.
                  </Typography>
                </Paper>
              </Grid>
            )}
          </Grid>
        </>
      )}
    </Box>
  );
};

export default SpaceSearch;

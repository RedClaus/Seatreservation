import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Button, 
  Chip,
  SelectChangeEvent
} from '@mui/material';
import { ZoomIn, ZoomOut } from '@mui/icons-material';

const FloorPlan: React.FC = () => {
  const [building, setBuilding] = useState('1');
  const [floor, setFloor] = useState('3');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [selectedSpace, setSelectedSpace] = useState<string | null>(null);

  // Mock data for buildings
  const buildings = [
    { id: '1', name: 'Headquarters' },
    { id: '2', name: 'Downtown Office' },
    { id: '3', name: 'Tech Campus' }
  ];

  // Mock data for floors
  const floors = [
    { id: '1', name: '1st Floor' },
    { id: '2', name: '2nd Floor' },
    { id: '3', name: '3rd Floor' },
    { id: '4', name: '4th Floor' },
    { id: '5', name: '5th Floor' }
  ];

  // Mock data for spaces on the floor
  const spaces = [
    { id: 'desk-a1', type: 'desk', x: 100, y: 100, width: 40, height: 20, status: 'available', name: 'Desk A-1' },
    { id: 'desk-a2', type: 'desk', x: 100, y: 130, width: 40, height: 20, status: 'occupied', name: 'Desk A-2' },
    { id: 'desk-a3', type: 'desk', x: 100, y: 160, width: 40, height: 20, status: 'reserved', name: 'Desk A-3' },
    { id: 'desk-b1', type: 'desk', x: 200, y: 100, width: 40, height: 20, status: 'available', name: 'Desk B-1' },
    { id: 'desk-b2', type: 'desk', x: 200, y: 130, width: 40, height: 20, status: 'available', name: 'Desk B-2' },
    { id: 'meeting-1', type: 'meeting-room', x: 300, y: 100, width: 80, height: 60, status: 'available', name: 'Meeting Room 1' },
    { id: 'meeting-2', type: 'meeting-room', x: 300, y: 200, width: 80, height: 60, status: 'reserved', name: 'Meeting Room 2' },
    { id: 'phone-1', type: 'phone-booth', x: 150, y: 250, width: 30, height: 30, status: 'available', name: 'Phone Booth 1' },
    { id: 'phone-2', type: 'phone-booth', x: 190, y: 250, width: 30, height: 30, status: 'occupied', name: 'Phone Booth 2' }
  ];

  const handleBuildingChange = (event: SelectChangeEvent) => {
    setBuilding(event.target.value);
  };

  const handleFloorChange = (event: SelectChangeEvent) => {
    setFloor(event.target.value);
  };

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.2, 2));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.2, 0.5));
  };

  const handleSpaceClick = (id: string) => {
    setSelectedSpace(id);
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

  const getSelectedSpace = () => {
    return spaces.find(space => space.id === selectedSpace);
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Floor Plans
      </Typography>

      {/* Controls */}
      <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel id="building-label">Building</InputLabel>
              <Select
                labelId="building-label"
                id="building-select"
                value={building}
                label="Building"
                onChange={handleBuildingChange}
              >
                {buildings.map((b) => (
                  <MenuItem key={b.id} value={b.id}>
                    {b.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel id="floor-label">Floor</InputLabel>
              <Select
                labelId="floor-label"
                id="floor-select"
                value={floor}
                label="Floor"
                onChange={handleFloorChange}
              >
                {floors.map((f) => (
                  <MenuItem key={f.id} value={f.id}>
                    {f.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button 
                variant="outlined" 
                startIcon={<ZoomOut />}
                onClick={handleZoomOut}
                sx={{ mr: 1 }}
              >
                Zoom Out
              </Button>
              <Button 
                variant="outlined" 
                startIcon={<ZoomIn />}
                onClick={handleZoomIn}
              >
                Zoom In
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Floor Plan and Details */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper elevation={2} sx={{ p: 2, height: '600px', position: 'relative', overflow: 'hidden' }}>
            {/* Floor Plan SVG */}
            <Box 
              sx={{ 
                width: '100%', 
                height: '100%', 
                position: 'relative',
                transform: `scale(${zoomLevel})`,
                transformOrigin: 'top left',
                transition: 'transform 0.3s ease'
              }}
            >
              {/* Background grid */}
              <svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0 }}>
                <rect x="0" y="0" width="100%" height="100%" fill="#f5f5f5" />
                <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e0e0e0" strokeWidth="1" />
                </pattern>
                <rect x="0" y="0" width="100%" height="100%" fill="url(#grid)" />
                
                {/* Walls and fixed elements */}
                <rect x="50" y="50" width="400" height="300" fill="none" stroke="#424242" strokeWidth="2" />
                <rect x="50" y="50" width="400" height="50" fill="#e0e0e0" stroke="#424242" strokeWidth="1" />
                <text x="250" y="80" textAnchor="middle" fill="#424242" fontSize="14">Reception Area</text>
                
                {/* Spaces */}
                {spaces.map((space) => (
                  <g key={space.id} onClick={() => handleSpaceClick(space.id)}>
                    <rect
                      x={space.x}
                      y={space.y}
                      width={space.width}
                      height={space.height}
                      fill={getSpaceColor(space.status)}
                      stroke={selectedSpace === space.id ? '#000000' : '#757575'}
                      strokeWidth={selectedSpace === space.id ? 2 : 1}
                      style={{ cursor: 'pointer' }}
                    />
                    <text
                      x={space.x + space.width / 2}
                      y={space.y + space.height / 2 + 5}
                      textAnchor="middle"
                      fill="#ffffff"
                      fontSize="10"
                      style={{ pointerEvents: 'none' }}
                    >
                      {space.name}
                    </text>
                  </g>
                ))}
              </svg>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 2, height: '600px' }}>
            <Typography variant="h6" gutterBottom>
              Space Details
            </Typography>
            
            {selectedSpace ? (
              <Box>
                {(() => {
                  const space = getSelectedSpace();
                  if (!space) return null;
                  
                  return (
                    <>
                      <Typography variant="h6">{space.name}</Typography>
                      <Typography variant="body1" sx={{ mt: 2 }}>Type: {space.type}</Typography>
                      <Typography variant="body1" sx={{ mt: 1 }}>
                        Status: <Chip 
                          label={space.status} 
                          sx={{ 
                            backgroundColor: getSpaceColor(space.status),
                            color: 'white'
                          }} 
                        />
                      </Typography>
                      
                      <Box sx={{ mt: 3 }}>
                        <Typography variant="body2" color="text.secondary">
                          Location: 3rd Floor, Headquarters
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Amenities: Monitor, Docking Station, Adjustable Height
                        </Typography>
                      </Box>
                      
                      {space.status === 'available' && (
                        <Button 
                          variant="contained" 
                          fullWidth 
                          sx={{ mt: 4 }}
                        >
                          Book This Space
                        </Button>
                      )}
                    </>
                  );
                })()}
              </Box>
            ) : (
              <Box sx={{ textAlign: 'center', mt: 4 }}>
                <Typography variant="body1" color="text.secondary">
                  Select a space on the floor plan to view details
                </Typography>
              </Box>
            )}
            
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" gutterBottom>
                Legend
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Box sx={{ width: 20, height: 20, backgroundColor: '#4CAF50', mr: 1 }} />
                <Typography variant="body2">Available</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Box sx={{ width: 20, height: 20, backgroundColor: '#F44336', mr: 1 }} />
                <Typography variant="body2">Occupied</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Box sx={{ width: 20, height: 20, backgroundColor: '#FFC107', mr: 1 }} />
                <Typography variant="body2">Reserved</Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default FloorPlan;

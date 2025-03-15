# Global Seat Reservation System: API Specification

## API Overview

This document provides detailed specifications for the RESTful APIs that power the Global Seat Reservation System. These APIs enable client applications to interact with the system's core services, providing functionality for reservation management, space administration, user operations, and analytics.

## API Standards

### General Principles

- All APIs follow RESTful design principles
- JSON is used for request and response bodies
- HTTP status codes indicate success or failure
- Authentication is required for all endpoints (except public endpoints)
- API versioning is included in the URL path

### Base URL

```
https://api.reservation-system.company.com/v1
```

### Authentication

All API requests require authentication using OAuth 2.0 with JWT tokens:

```
Authorization: Bearer {token}
```

### Response Format

All responses follow a standard format:

```json
{
  "status": "success",
  "data": { ... },
  "meta": {
    "pagination": {
      "page": 1,
      "perPage": 20,
      "totalPages": 5,
      "totalItems": 100
    }
  }
}
```

Error responses:

```json
{
  "status": "error",
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "The requested resource was not found",
    "details": { ... }
  }
}
```

### Pagination

Paginated endpoints accept the following query parameters:

- `page`: Page number (default: 1)
- `perPage`: Items per page (default: 20, max: 100)

### Filtering

Filtering is supported using query parameters:

- Simple filters: `?status=active`
- Multiple values: `?status=active,pending`
- Date ranges: `?startDate=2025-01-01&endDate=2025-01-31`

### Sorting

Sorting is supported using the `sort` query parameter:

- Ascending: `?sort=name`
- Descending: `?sort=-name`
- Multiple fields: `?sort=name,-createdAt`

## API Services

### 1. Authentication Service

#### 1.1 Login

```
POST /auth/login
```

Request:

```json
{
  "email": "user@company.com",
  "password": "password123"
}
```

Response:

```json
{
  "status": "success",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 3600,
    "user": {
      "id": "user123",
      "email": "user@company.com",
      "name": "John Doe",
      "role": "employee"
    }
  }
}
```

#### 1.2 Refresh Token

```
POST /auth/refresh
```

Request:

```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

Response:

```json
{
  "status": "success",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 3600
  }
}
```

#### 1.3 Logout

```
POST /auth/logout
```

Request:

```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

Response:

```json
{
  "status": "success",
  "data": {
    "message": "Successfully logged out"
  }
}
```

### 2. Reservation Service

#### 2.1 List Reservations

```
GET /reservations
```

Query Parameters:
- `status`: Filter by status (active, cancelled, completed)
- `startDate`: Filter by start date
- `endDate`: Filter by end date
- `spaceId`: Filter by space ID
- `userId`: Filter by user ID (admin only)
- `buildingId`: Filter by building ID
- `floorId`: Filter by floor ID

Response:

```json
{
  "status": "success",
  "data": {
    "reservations": [
      {
        "id": "res123",
        "spaceId": "space456",
        "userId": "user789",
        "startTime": "2025-03-15T09:00:00Z",
        "endTime": "2025-03-15T17:00:00Z",
        "status": "active",
        "checkInStatus": "pending",
        "createdAt": "2025-03-10T14:30:00Z",
        "updatedAt": "2025-03-10T14:30:00Z",
        "space": {
          "id": "space456",
          "name": "Desk A-123",
          "type": "desk",
          "floor": "3rd Floor",
          "building": "Headquarters"
        }
      }
    ]
  },
  "meta": {
    "pagination": {
      "page": 1,
      "perPage": 20,
      "totalPages": 5,
      "totalItems": 100
    }
  }
}
```

#### 2.2 Create Reservation

```
POST /reservations
```

Request:

```json
{
  "spaceId": "space456",
  "startTime": "2025-03-20T09:00:00Z",
  "endTime": "2025-03-20T17:00:00Z",
  "notes": "Client meeting in the morning",
  "recurrence": {
    "pattern": "weekly",
    "daysOfWeek": ["monday", "wednesday", "friday"],
    "endDate": "2025-04-20"
  }
}
```

Response:

```json
{
  "status": "success",
  "data": {
    "reservation": {
      "id": "res124",
      "spaceId": "space456",
      "userId": "user789",
      "startTime": "2025-03-20T09:00:00Z",
      "endTime": "2025-03-20T17:00:00Z",
      "status": "active",
      "checkInStatus": "pending",
      "notes": "Client meeting in the morning",
      "recurrence": {
        "pattern": "weekly",
        "daysOfWeek": ["monday", "wednesday", "friday"],
        "endDate": "2025-04-20"
      },
      "createdAt": "2025-03-15T12:30:00Z",
      "updatedAt": "2025-03-15T12:30:00Z"
    }
  }
}
```

#### 2.3 Get Reservation Details

```
GET /reservations/{id}
```

Response:

```json
{
  "status": "success",
  "data": {
    "reservation": {
      "id": "res123",
      "spaceId": "space456",
      "userId": "user789",
      "startTime": "2025-03-15T09:00:00Z",
      "endTime": "2025-03-15T17:00:00Z",
      "status": "active",
      "checkInStatus": "pending",
      "notes": "Client meeting in the morning",
      "createdAt": "2025-03-10T14:30:00Z",
      "updatedAt": "2025-03-10T14:30:00Z",
      "space": {
        "id": "space456",
        "name": "Desk A-123",
        "type": "desk",
        "floor": "3rd Floor",
        "building": "Headquarters",
        "amenities": ["monitor", "docking-station", "adjustable-height"]
      },
      "user": {
        "id": "user789",
        "name": "John Doe",
        "email": "john.doe@company.com",
        "department": "Marketing"
      }
    }
  }
}
```

#### 2.4 Update Reservation

```
PUT /reservations/{id}
```

Request:

```json
{
  "startTime": "2025-03-15T10:00:00Z",
  "endTime": "2025-03-15T18:00:00Z",
  "notes": "Updated: Client meeting in the morning, team work in the afternoon"
}
```

Response:

```json
{
  "status": "success",
  "data": {
    "reservation": {
      "id": "res123",
      "spaceId": "space456",
      "userId": "user789",
      "startTime": "2025-03-15T10:00:00Z",
      "endTime": "2025-03-15T18:00:00Z",
      "status": "active",
      "checkInStatus": "pending",
      "notes": "Updated: Client meeting in the morning, team work in the afternoon",
      "createdAt": "2025-03-10T14:30:00Z",
      "updatedAt": "2025-03-15T12:45:00Z"
    }
  }
}
```

#### 2.5 Cancel Reservation

```
DELETE /reservations/{id}
```

Response:

```json
{
  "status": "success",
  "data": {
    "message": "Reservation successfully cancelled",
    "reservation": {
      "id": "res123",
      "status": "cancelled",
      "updatedAt": "2025-03-15T13:00:00Z"
    }
  }
}
```

#### 2.6 Check In

```
POST /reservations/{id}/checkin
```

Request:

```json
{
  "location": {
    "latitude": 37.7749,
    "longitude": -122.4194
  }
}
```

Response:

```json
{
  "status": "success",
  "data": {
    "reservation": {
      "id": "res123",
      "checkInStatus": "checked-in",
      "checkInTime": "2025-03-15T09:05:00Z",
      "updatedAt": "2025-03-15T09:05:00Z"
    }
  }
}
```

#### 2.7 Check Out

```
POST /reservations/{id}/checkout
```

Response:

```json
{
  "status": "success",
  "data": {
    "reservation": {
      "id": "res123",
      "checkInStatus": "checked-out",
      "checkOutTime": "2025-03-15T17:10:00Z",
      "updatedAt": "2025-03-15T17:10:00Z"
    }
  }
}
```

#### 2.8 Find Available Spaces

```
GET /reservations/available
```

Query Parameters:
- `startTime`: Start time (required)
- `endTime`: End time (required)
- `buildingId`: Filter by building ID
- `floorId`: Filter by floor ID
- `spaceType`: Filter by space type (desk, meeting-room, etc.)
- `amenities`: Filter by amenities (comma-separated)
- `capacity`: Minimum capacity (for meeting rooms)
- `nearTeam`: Find spaces near team members

Response:

```json
{
  "status": "success",
  "data": {
    "spaces": [
      {
        "id": "space456",
        "name": "Desk A-123",
        "type": "desk",
        "floor": "3rd Floor",
        "building": "Headquarters",
        "amenities": ["monitor", "docking-station", "adjustable-height"],
        "availability": {
          "startTime": "2025-03-20T09:00:00Z",
          "endTime": "2025-03-20T17:00:00Z"
        }
      }
    ]
  },
  "meta": {
    "pagination": {
      "page": 1,
      "perPage": 20,
      "totalPages": 3,
      "totalItems": 50
    }
  }
}
```

### 3. Space Management Service

#### 3.1 List Buildings

```
GET /buildings
```

Query Parameters:
- `region`: Filter by region
- `country`: Filter by country
- `city`: Filter by city
- `status`: Filter by status (active, inactive)

Response:

```json
{
  "status": "success",
  "data": {
    "buildings": [
      {
        "id": "building123",
        "name": "Headquarters",
        "address": "123 Main St, San Francisco, CA 94105",
        "region": "North America",
        "country": "USA",
        "city": "San Francisco",
        "timezone": "America/Los_Angeles",
        "status": "active",
        "floors": 10,
        "totalSpaces": 500,
        "amenities": ["cafeteria", "gym", "parking"]
      }
    ]
  },
  "meta": {
    "pagination": {
      "page": 1,
      "perPage": 20,
      "totalPages": 6,
      "totalItems": 115
    }
  }
}
```

#### 3.2 Get Building Details

```
GET /buildings/{id}
```

Response:

```json
{
  "status": "success",
  "data": {
    "building": {
      "id": "building123",
      "name": "Headquarters",
      "address": "123 Main St, San Francisco, CA 94105",
      "region": "North America",
      "country": "USA",
      "city": "San Francisco",
      "timezone": "America/Los_Angeles",
      "status": "active",
      "floors": 10,
      "totalSpaces": 500,
      "amenities": ["cafeteria", "gym", "parking"],
      "operatingHours": {
        "monday": { "open": "07:00", "close": "20:00" },
        "tuesday": { "open": "07:00", "close": "20:00" },
        "wednesday": { "open": "07:00", "close": "20:00" },
        "thursday": { "open": "07:00", "close": "20:00" },
        "friday": { "open": "07:00", "close": "20:00" },
        "saturday": { "open": "09:00", "close": "17:00" },
        "sunday": { "open": "closed", "close": "closed" }
      },
      "contactInfo": {
        "facilityManager": "Jane Smith",
        "email": "facilities@company.com",
        "phone": "+1-555-123-4567"
      },
      "createdAt": "2024-01-15T00:00:00Z",
      "updatedAt": "2025-02-10T15:30:00Z"
    }
  }
}
```

#### 3.3 List Floors in a Building

```
GET /buildings/{id}/floors
```

Response:

```json
{
  "status": "success",
  "data": {
    "floors": [
      {
        "id": "floor123",
        "buildingId": "building123",
        "name": "3rd Floor",
        "level": 3,
        "capacity": 120,
        "spaceTypes": {
          "desk": 80,
          "meeting-room": 10,
          "phone-booth": 5,
          "collaboration-area": 3
        },
        "status": "active",
        "floorPlanUrl": "https://storage.company.com/floorplans/building123-floor3.svg"
      }
    ]
  },
  "meta": {
    "pagination": {
      "page": 1,
      "perPage": 20,
      "totalPages": 1,
      "totalItems": 10
    }
  }
}
```

#### 3.4 Get Floor Details

```
GET /floors/{id}
```

Response:

```json
{
  "status": "success",
  "data": {
    "floor": {
      "id": "floor123",
      "buildingId": "building123",
      "name": "3rd Floor",
      "level": 3,
      "capacity": 120,
      "spaceTypes": {
        "desk": 80,
        "meeting-room": 10,
        "phone-booth": 5,
        "collaboration-area": 3
      },
      "status": "active",
      "floorPlanUrl": "https://storage.company.com/floorplans/building123-floor3.svg",
      "floorPlanData": {
        "width": 1200,
        "height": 800,
        "scale": "1:100",
        "orientation": "north-up"
      },
      "zones": [
        {
          "id": "zone123",
          "name": "Engineering Zone",
          "type": "department",
          "coordinates": {
            "x1": 100,
            "y1": 100,
            "x2": 500,
            "y2": 300
          }
        }
      ],
      "createdAt": "2024-01-15T00:00:00Z",
      "updatedAt": "2025-02-10T15:30:00Z"
    }
  }
}
```

#### 3.5 List Spaces on a Floor

```
GET /floors/{id}/spaces
```

Query Parameters:
- `type`: Filter by space type
- `status`: Filter by status (active, inactive, maintenance)
- `amenities`: Filter by amenities (comma-separated)

Response:

```json
{
  "status": "success",
  "data": {
    "spaces": [
      {
        "id": "space456",
        "floorId": "floor123",
        "name": "Desk A-123",
        "type": "desk",
        "status": "active",
        "coordinates": {
          "x": 350,
          "y": 200
        },
        "rotation": 90,
        "amenities": ["monitor", "docking-station", "adjustable-height"],
        "attributes": {
          "nearWindow": true,
          "quietZone": false
        },
        "zoneId": "zone123"
      }
    ]
  },
  "meta": {
    "pagination": {
      "page": 1,
      "perPage": 20,
      "totalPages": 4,
      "totalItems": 80
    }
  }
}
```

#### 3.6 Get Space Details

```
GET /spaces/{id}
```

Response:

```json
{
  "status": "success",
  "data": {
    "space": {
      "id": "space456",
      "floorId": "floor123",
      "buildingId": "building123",
      "name": "Desk A-123",
      "type": "desk",
      "status": "active",
      "coordinates": {
        "x": 350,
        "y": 200
      },
      "rotation": 90,
      "amenities": ["monitor", "docking-station", "adjustable-height"],
      "attributes": {
        "nearWindow": true,
        "quietZone": false
      },
      "zoneId": "zone123",
      "availability": {
        "today": [
          {
            "startTime": "09:00",
            "endTime": "12:00",
            "status": "reserved"
          },
          {
            "startTime": "12:00",
            "endTime": "17:00",
            "status": "available"
          }
        ],
        "nextSevenDays": {
          "availableDays": 5,
          "availablePercentage": 71
        }
      },
      "photos": [
        {
          "url": "https://storage.company.com/spaces/space456-1.jpg",
          "caption": "Desk with monitor and docking station"
        }
      ],
      "createdAt": "2024-01-15T00:00:00Z",
      "updatedAt": "2025-02-10T15:30:00Z"
    }
  }
}
```

#### 3.7 Update Space Details

```
PUT /spaces/{id}
```

Request:

```json
{
  "status": "maintenance",
  "amenities": ["monitor", "docking-station", "adjustable-height", "ergonomic-chair"],
  "attributes": {
    "nearWindow": true,
    "quietZone": true
  },
  "maintenanceDetails": {
    "reason": "Chair replacement",
    "estimatedCompletion": "2025-03-20T17:00:00Z"
  }
}
```

Response:

```json
{
  "status": "success",
  "data": {
    "space": {
      "id": "space456",
      "status": "maintenance",
      "amenities": ["monitor", "docking-station", "adjustable-height", "ergonomic-chair"],
      "attributes": {
        "nearWindow": true,
        "quietZone": true
      },
      "maintenanceDetails": {
        "reason": "Chair replacement",
        "estimatedCompletion": "2025-03-20T17:00:00Z"
      },
      "updatedAt": "2025-03-15T13:30:00Z"
    }
  }
}
```

#### 3.8 List Space Types

```
GET /spaces/types
```

Response:

```json
{
  "status": "success",
  "data": {
    "types": [
      {
        "id": "desk",
        "name": "Desk",
        "description": "Standard individual workspace",
        "defaultAmenities": ["desk", "chair"],
        "icon": "desk-icon"
      },
      {
        "id": "meeting-room",
        "name": "Meeting Room",
        "description": "Room for team meetings and collaboration",
        "defaultAmenities": ["table", "chairs", "whiteboard", "video-conference"],
        "icon": "meeting-room-icon"
      },
      {
        "id": "phone-booth",
        "name": "Phone Booth",
        "description": "Private space for calls and focused work",
        "defaultAmenities": ["desk", "chair", "sound-insulation"],
        "icon": "phone-booth-icon"
      }
    ]
  }
}
```

#### 3.9 List Amenities

```
GET /amenities
```

Response:

```json
{
  "status": "success",
  "data": {
    "amenities": [
      {
        "id": "monitor",
        "name": "Monitor",
        "category": "technology",
        "icon": "monitor-icon"
      },
      {
        "id": "docking-station",
        "name": "Docking Station",
        "category": "technology",
        "icon": "docking-station-icon"
      },
      {
        "id": "adjustable-height",
        "name": "Adjustable Height Desk",
        "category": "furniture",
        "icon": "adjustable-desk-icon"
      }
    ]
  }
}
```

### 4. User Service

#### 4.1 List Users

```
GET /users
```

Query Parameters:
- `department`: Filter by department
- `role`: Filter by role
- `status`: Filter by status (active, inactive)
- `search`: Search by name or email

Response:

```json
{
  "status": "success",
  "data": {
    "users": [
      {
        "id": "user789",
        "name": "John Doe",
        "email": "john.doe@company.com",
        "department": "Marketing",
        "role": "employee",
        "status": "active",
        "createdAt": "2024-01-15T00:00:00Z",
        "updatedAt": "2025-02-10T15:30:00Z"
      }
    ]
  },
  "meta": {
    "pagination": {
      "page": 1,
      "perPage": 20,
      "totalPages": 2000,
      "totalItems": 40000
    }
  }
}
```

#### 4.2 Get User Details

```
GET /users/{id}
```

Response:

```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "user789",
      "name": "John Doe",
      "email": "john.doe@company.com",
      "department": "Marketing",
      "title": "Marketing Specialist",
      "role": "employee",
      "status": "active",
      "preferences": {
        "defaultBuilding": "building123",
        "favoriteSpaces": ["space456", "space789"],
        "notificationPreferences": {
          "email": true,
          "push": true,
          "reminderTime": 30
        },
        "workingDays": ["monday", "tuesday", "wednesday", "thursday", "friday"]
      },
      "teams": [
        {
          "id": "team123",
          "name": "Marketing Team",
          "role": "member"
        }
      ],
      "createdAt": "2024-01-15T00:00:00Z",
      "updatedAt": "2025-02-10T15:30:00Z"
    }
  }
}
```

#### 4.3 Update User Details

```
PUT /users/{id}
```

Request:

```json
{
  "preferences": {
    "defaultBuilding": "building456",
    "favoriteSpaces": ["space456", "space789", "space101"],
    "notificationPreferences": {
      "email": true,
      "push": true,
      "reminderTime": 60
    }
  }
}
```

Response:

```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "user789",
      "preferences": {
        "defaultBuilding": "building456",
        "favoriteSpaces": ["space456", "space789", "space101"],
        "notificationPreferences": {
          "email": true,
          "push": true,
          "reminderTime": 60
        },
        "workingDays": ["monday", "tuesday", "wednesday", "thursday", "friday"]
      },
      "updatedAt": "2025-03-15T14:00:00Z"
    }
  }
}
```

#### 4.4 Get User's Reservations

```
GET /users/{id}/reservations
```

Query Parameters:
- `status`: Filter by status (active, cancelled, completed)
- `startDate`: Filter by start date
- `endDate`: Filter by end date

Response:

```json
{
  "status": "success",
  "data": {
    "reservations": [
      {
        "id": "res123",
        "spaceId": "space456",
        "startTime": "2025-03-15T09:00:00Z",
        "endTime": "2025-03-15T17:00:00Z",
        "status": "active",
        "checkInStatus": "pending",
        "space": {
          "id": "space456",
          "name": "Desk A-123",
          "type": "desk",
          "floor": "3rd Floor",
          "building": "Headquarters"
        }
      }
    ]
  },
  "meta": {
    "pagination": {
      "page": 1,
      "perPage": 20,
      "totalPages": 2,
      "totalItems": 25
    }
  }
}
```

#### 4.5 List Teams

```
GET /teams
```

Query Parameters:
- `department`: Filter by department
- `search`: Search by name

Response:

```json
{
  "status": "success",
  "data": {
    "teams": [
      {
        "id": "team123",
        "name": "Marketing Team",
        "department": "Marketing",
        "memberCount": 12,
        "createdAt": "2024-01-15T00:00:00Z",
        "updatedAt": "2025-02-10T15:30:00Z"
      }
    ]
  },
  "meta": {
    "pagination": {
      "page": 1,
      "perPage": 20,
      "totalPages": 10,
      "totalItems": 200
    }
  }
}
```

#### 4.6 Get Team Details

```
GET /teams/{id}
```

Response:

```json
{
  "status": "success",
  "data": {
    "team": {
      "id": "team123",
      "name": "Marketing Team",
      "department": "Marketing",
      "description": "Global marketing team responsible for brand and campaigns",
      "leaderId": "user456",
      "leader": {
        "id": "user456",
        "name": "Jane Smith",
        "email": "jane.smith@company.com",
        "title": "Marketing Director"
      },
      "createdAt": "2024-01-15T00:00:00Z",
      "updatedAt": "2025-02-10T15:30:00Z"
    }
  }
}
```

#### 4.7 List Team Members

```
GET /teams/{id}/members
```

Response:

```json
{
  "status": "success",
  "data": {
    "members": [
      {
        "id": "user789",
        "name": "John Doe",
        "email": "john.doe@company.com",
        "title": "Marketing Specialist",
        "role": "member",
        "joinedAt": "2024-01-15T00:00:00Z"
      }
    ]
  },
  "meta": {
    "pagination": {
      "page": 1,
      "perPage": 20,
      "totalPages": 1,
      "totalItems": 12
    }
  }
}
```

#### 4.8 Get Team Reservations

```
GET /teams/{id}/reservations
```

Query Parameters:
- `status`: Filter by status (active, cancelled, completed)
- `startDate`: Filter by start date
- `endDate`: Filter by end date

Response:

```json
{
  "status": "success",
  "data": {
    "reservations": [
      {
        "id": "res123",
        "spaceId": "space456",
        "userId": "user789",
        "startTime": "2025-03-15T09:00:00Z",
        "endTime": "2025-03-15T17:00:00Z",
        "status": "active",
        "user": {
          "id": "user789",
          "name": "John Doe"
        },
        "space": {
          "id": "space456",
          "name": "Desk A-123",
          "type": "desk",
          "floor": "3rd Floor",
          "building": "Headquarters"
        }
      }
    ]
  },
  "meta": {
    "pagination": {
      "page": 1,
      "per

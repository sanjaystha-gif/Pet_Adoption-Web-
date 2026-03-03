# PawBuddy - Pet Adoption API

Production-ready backend API for a Pet Adoption web application built with Node.js, Express, TypeScript, and MongoDB Atlas.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- MongoDB Atlas account with connection URI
- Postman (for API testing)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd pawbuddy_backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Setup environment variables**
```bash
# Copy example environment file
cp .env.example .env

# Edit .env with your MongoDB Atlas URI and JWT secrets
# Example:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/pawbuddy?retryWrites=true&w=majority
# JWT_ACCESS_SECRET=your_secret_key_here
# JWT_REFRESH_SECRET=your_refresh_secret_here
```

4. **Start the server**
```bash
# Development mode with hot reload
npm run dev

# Production build and start
npm run build
npm start
```

5. **Seed database with sample data**
```bash
npm run seed

# Login credentials:
# Admin: admin@pawbuddy.com / admin123
# Adopter 1: john@example.com / adopter123
# Adopter 2: sarah@example.com / adopter123
```

## 📡 API Documentation

### Base URL
```
http://localhost:3000/api
```

### API Docs (Swagger)
Visit `http://localhost:3000/api-docs` after starting the server

## 🔐 Authentication

All protected endpoints require Bearer token in Authorization header:
```
Authorization: Bearer <access_token>
```

### Auth Endpoints

**Register**
```
POST /api/auth/register
```
Body:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword",
  "role": "adopter"
}
```

**Login**
```
POST /api/auth/login
```
Body:
```json
{
  "email": "john@example.com",
  "password": "securepassword"
}
```
Response:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "adopter"
    },
    "accessToken": "jwt_token",
    "refreshToken": "refresh_token"
  }
}
```

**Refresh Token**
```
POST /api/auth/refresh
```
Body:
```json
{
  "refreshToken": "refresh_token"
}
```

**Get Profile**
```
GET /api/auth/me
```

**Logout**
```
POST /api/auth/logout
```

## 🐾 Pets Endpoints

### Get All Pets
```
GET /api/pets?page=1&pageSize=10
```

Query Parameters:
- `page` - Page number (default: 1)
- `pageSize` - Items per page (default: 10)
- `q` - Search query (name/description)
- `type` - Filter by type (dog, cat)
- `breed` - Filter by breed
- `gender` - Filter by gender (male, female)
- `size` - Filter by size (small, medium, large)
- `status` - Filter by status (available, pending, adopted)
- `location` - Filter by location
- `ageRange` - Filter by age (baby, young, adult, senior)
- `sort` - Sort order (newest, oldest, name-asc, name-desc)

Response:
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "pet_id",
        "name": "Max",
        "type": "dog",
        "breed": "Golden Retriever",
        "age": 36,
        "ageDisplay": "3 years",
        "gender": "male",
        "size": "large",
        "color": "Golden",
        "weight": "70 lbs",
        "vaccinated": true,
        "neutered": true,
        "status": "available",
        "description": "Friendly dog",
        "personality": ["Friendly", "Loyal"],
        "images": ["url1", "url2"],
        "location": "New York, NY",
        "postedDate": "2024-02-20T00:00:00.000Z",
        "createdBy": "admin_id",
        "createdAt": "2024-02-20T00:00:00.000Z",
        "updatedAt": "2024-02-20T00:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "pageSize": 10,
      "total": 100,
      "totalPages": 10
    }
  }
}
```

### Get Pet by ID
```
GET /api/pets/{petId}
```

### Create Pet (Admin Only)
```
POST /api/pets
Authorization: Bearer <admin_token>
```
Body:
```json
{
  "name": "Buddy",
  "type": "dog",
  "breed": "Labrador",
  "age": 12,
  "gender": "male",
  "size": "large",
  "color": "Black",
  "weight": "60 lbs",
  "vaccinated": true,
  "neutered": true,
  "status": "available",
  "description": "Friendly Labrador",
  "personality": ["Friendly", "Energetic"],
  "images": ["https://example.com/image.jpg"],
  "location": "New York, NY"
}
```

### Update Pet (Admin Only)
```
PATCH /api/pets/{petId}
Authorization: Bearer <admin_token>
```

### Delete Pet (Admin Only)
```
DELETE /api/pets/{petId}
Authorization: Bearer <admin_token>
```

## 📅 Bookings Endpoints

### Create Booking
```
POST /api/bookings
Authorization: Bearer <user_token>
```
Body:
```json
{
  "petId": "pet_id",
  "message": "I would love to adopt this pet!",
  "homeType": "House",
  "yardStatus": "Large fenced yard",
  "workSchedule": "One parent works from home",
  "currentPets": [
    {
      "type": "cat",
      "breed": "Siamese",
      "name": "Whiskers"
    }
  ],
  "petExperience": "I have owned pets before",
  "lifetimeCommitment": true
}
```

### Get My Bookings
```
GET /api/bookings/me?page=1&pageSize=10
Authorization: Bearer <user_token>
```

### Cancel Booking
```
DELETE /api/bookings/{bookingId}
Authorization: Bearer <user_token>
```

### Get All Bookings (Admin Only)
```
GET /api/bookings/admin/all?status=pending
Authorization: Bearer <admin_token>
```

### Update Booking Status (Admin Only)
```
PATCH /api/bookings/admin/{bookingId}/status
Authorization: Bearer <admin_token>
```
Body:
```json
{
  "status": "approved"
}
```

## ❤️ Favourites Endpoints

### Get My Favourites
```
GET /api/favourites/me?page=1&pageSize=10
Authorization: Bearer <user_token>
```

### Add to Favourites
```
POST /api/favourites/{petId}
Authorization: Bearer <user_token>
```

### Remove from Favourites
```
DELETE /api/favourites/{petId}
Authorization: Bearer <user_token>
```

## 👥 Admin Users Endpoints

### Get All Users
```
GET /api/admin/users?page=1&pageSize=10
Authorization: Bearer <admin_token>
```

### Update User Role
```
PATCH /api/admin/users/{userId}/role
Authorization: Bearer <admin_token>
```
Body:
```json
{
  "role": "admin"
}
```

### Update Own Profile
```
PATCH /api/admin/profile
Authorization: Bearer <user_token>
```
Body:
```json
{
  "name": "Updated Name",
  "phone": "+1-555-1234",
  "city": "New York",
  "bio": "Pet lover"
}
```

## 📊 Database Schema

### User Model
```typescript
{
  id: string;
  name: string;
  email: string;
  password: string (hashed);
  role: 'admin' | 'adopter';
  avatar?: string;
  phone?: string;
  bio?: string;
  city?: string;
  joinedDate: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

### Pet Model
```typescript
{
  id: string;
  name: string;
  type: 'dog' | 'cat';
  breed: string;
  age: number; // in months
  ageDisplay: string; // computed field
  gender: 'male' | 'female';
  size: 'small' | 'medium' | 'large';
  color: string;
  weight: string;
  vaccinated: boolean;
  neutered: boolean;
  status: 'available' | 'pending' | 'adopted';
  description: string;
  personality: string[];
  images: string[];
  location: string;
  postedDate: Date;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Booking Model
```typescript
{
  id: string;
  petId: string;
  petName: string;
  petImage: string;
  adopterId: string;
  adopterName: string;
  adopterEmail: string;
  adopterPhone: string;
  message: string;
  homeType?: string;
  yardStatus?: string;
  workSchedule?: string;
  currentPets?: Array<{ type, breed, name }>;
  petExperience?: string;
  lifetimeCommitment?: boolean;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: Date;
  updatedAt: Date;
  createdAt: Date;
}
```

### Favourite Model
```typescript
{
  id: string;
  userId: string;
  petId: string;
  createdAt: Date;
  updatedAt: Date;
}
```

## 🧪 Testing with Postman

1. **Import Collection and Environment**
   - Open Postman
   - Click "Import"
   - Select both `postman_collection.json` and `postman_environment.json`

2. **Set Up Environment**
   - Select the imported environment from the dropdown
   - Update `baseUrl` if running on a different port

3. **Test Flow**
   - Call Login endpoint to get access token (auto-saved in environment)
   - Use access token for subsequent authenticated requests
   - Token auto-refresh is set up in Postman tests

## 📝 Project Structure

```
src/
├── app.ts                          # Express app setup
├── index.ts                        # Server entry point
├── config/
│   ├── database.ts                # MongoDB connection
│   └── environment.ts             # Environment variables
├── models/
│   ├── User.ts
│   ├── Pet.ts
│   ├── Booking.ts
│   ├── Favourite.ts
│   ├── RefreshToken.ts
│   └── index.ts
├── modules/
│   ├── auth/
│   │   ├── auth.controller.ts
│   │   ├── auth.validator.ts
│   │   └── auth.routes.ts
│   ├── pets/
│   │   ├── pets.controller.ts
│   │   ├── pets.validator.ts
│   │   └── pets.routes.ts
│   ├── bookings/
│   │   ├── bookings.controller.ts
│   │   ├── bookings.validator.ts
│   │   └── bookings.routes.ts
│   ├── favourites/
│   │   ├── favourites.controller.ts
│   │   └── favourites.routes.ts
│   └── admin/
│       ├── admin.controller.ts
│       └── admin.routes.ts
├── middlewares/
│   ├── auth.ts                    # JWT authentication
│   ├── errorHandler.ts            # Error handling
│   └── validate.ts                # Request validation
├── types/
│   └── index.ts                   # TypeScript types
├── utils/
│   ├── response.ts                # Response formatting
│   └── auth.ts                    # Auth utilities
└── scripts/
    └── seed.ts                    # Database seeding
```

## 🛡️ Security Features

- ✅ JWT authentication with access & refresh tokens
- ✅ Password hashing with bcrypt
- ✅ Helmet for HTTP headers security
- ✅ CORS protection
- ✅ Rate limiting on auth endpoints
- ✅ Request validation with Zod
- ✅ Environment variable protection
- ✅ Role-based access control (RBAC)
- ✅ RefreshToken rotation

## 🔄 Token Management

**Access Token**
- Short expiry (15 minutes)
- Used for authenticated API requests
- Lost on logout

**Refresh Token**
- Long expiry (7 days)
- Stored securely in database (hashed)
- Used to get new access tokens
- Revoked on logout
- Auto-rotated on each refresh

## 🌐 MongoDB Atlas Setup

1. Create a cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a database user with read/write permissions
3. Get your connection URI
4. Update `MONGODB_URI` in `.env` file

Example URI format:
```
mongodb+srv://username:password@cluster.mongodb.net/pawbuddy?retryWrites=true&w=majority
```

## 📚 API Response Format

All responses follow consistent envelope format:

**Success Response**
```json
{
  "success": true,
  "data": { /* data object */ },
  "message": "Optional message"
}
```

**Error Response**
```json
{
  "success": false,
  "error": "Error message",
  "message": "Detailed message"
}
```

**Paginated Response**
```json
{
  "success": true,
  "data": {
    "items": [ /* array of items */ ],
    "pagination": {
      "page": 1,
      "pageSize": 10,
      "total": 100,
      "totalPages": 10
    }
  }
}
```

## 🚨 Error Handling

Standard HTTP status codes:
- `200` - OK
- `201` - Created
- `400` - Bad Request (Validation error)
- `401` - Unauthorized (Authentication required)
- `403` - Forbidden (Insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

## 📦 NPM Scripts

```bash
npm run dev       # Start with hot reload
npm run build     # Build TypeScript
npm start         # Run production build
npm run seed      # Seed database
npm run watch     # Watch TypeScript compilation
```

## 🤝 Frontend Integration

The backend is designed to integrate seamlessly with the React + TypeScript frontend:

1. **Field Names**: All field names match frontend expectations exactly
2. **Enums**: Pet types, genders, sizes, and statuses are consistent
3. **Age Format**: Age stored in months, `ageDisplay` computed by backend
4. **Response Format**: Global API envelope format for consistency
5. **Pagination**: Standardized pagination with page, pageSize, total, totalPages

## 📞 Support & Documentation

- API Docs: `http://localhost:3000/api-docs`
- Health Check: `GET http://localhost:3000/health`

## 📄 License

MIT

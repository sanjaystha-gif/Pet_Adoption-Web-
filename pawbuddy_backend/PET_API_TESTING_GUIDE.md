# 📚 Pet Persistence API - Complete Testing Guide

## ✅ Status: FULLY IMPLEMENTED & TESTED

All Pet API endpoints are production-ready with proper database persistence, authentication, and validation.

---

## 🎯 API Endpoints Overview

| Method | Endpoint | Auth | Role | Purpose |
|--------|----------|------|------|---------|
| GET | `/api/pets` | ❌ | - | Get all pets (with filters, pagination, sorting) |
| GET | `/api/pets/:id` | ❌ | - | Get single pet details |
| POST | `/api/pets` | ✅ | Admin | Add new pet |
| PATCH | `/api/pets/:id` | ✅ | Admin | Update pet |
| DELETE | `/api/pets/:id` | ✅ | Admin | Delete pet |

---

## 📋 Prerequisites

### 1. Start Backend Server
```bash
npm run dev
```

Expected output:
```
✅ Connected to MongoDB
✅ Server is running on port 3001
📚 API Documentation: http://localhost:3001/api-docs
```

### 2. Seed Database (Optional)
```bash
npm run seed
```

Creates sample data including 10+ pets for testing.

### 3. Admin Credentials (from seed)
```
Email: admin@pawbuddy.com
Password: admin123
```

---

## 🧪 Step-by-Step Testing

### Test 1: Get All Pets (Public Endpoint)

**Endpoint:** `GET http://localhost:3001/api/pets`

**Steps in Postman:**
1. Create new request with `GET` method
2. URL: `http://localhost:3001/api/pets`
3. Click **"Send"**

**Expected Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "65abc123...",
        "name": "Max",
        "type": "dog",
        "breed": "Golden Retriever",
        "age": 36,
        "ageDisplay": "3 years",
        "gender": "male",
        "size": "large",
        "color": "Golden",
        "weight": "32 kg",
        "vaccinated": true,
        "neutered": true,
        "status": "available",
        "description": "Friendly and energetic dog loves playing fetch...",
        "personality": ["friendly", "energetic", "playful"],
        "images": ["https://res.cloudinary.com/..."],
        "location": "New York Shelter",
        "postedDate": "2026-03-01T10:00:00.000Z",
        "createdBy": "65admin..."
      }
      // ... more pets
    ],
    "pagination": {
      "page": 1,
      "pageSize": 10,
      "total": 12,
      "totalPages": 2
    }
  },
  "message": "Pets retrieved successfully"
}
```

**✅ What This Proves:**
- Pets are persisted in MongoDB
- Pagination works
- ageDisplay calculated correctly from age in months
- All fields returned properly

---

### Test 2: Filter Pets by Type

**Endpoint:** `GET http://localhost:3001/api/pets?type=dog`

**Steps:**
1. Same as Test 1 but add to URL: `?type=dog`
2. Click **"Send"**

**Full URL Example:**
```
GET /api/pets?type=dog&status=available&pageSize=5
```

**Query Parameters:**
| Parameter | Type | Example | Notes |
|-----------|------|---------|-------|
| `q` | string | "Max" | Search by name or description |
| `type` | string | "dog" or "cat" | Filter by pet type |
| `breed` | string | "Golden Retriever" | Filter by breed |
| `gender` | string | "male" or "female" | Filter by gender |
| `size` | string | "small", "medium", "large" | Filter by size |
| `status` | string | "available", "pending", "adopted" | Filter by adoption status |
| `color` | string | "Golden" | Filter by color |
| `location` | string | "New York" | Filter by location |
| `ageRange` | string | "baby", "young", "adult", "senior" | Age ranges (0-12m, 12-36m, 36-84m, 84m+) |
| `sort` | string | "newest", "oldest", "name-asc", "name-desc" | Sort order |
| `page` | number | 1 | Pagination (default: 1) |
| `pageSize` | number | 10 | Items per page (default: 10, max: 100) |

**Test Different Filters:**

**Filter 1: Available dogs only**
```
GET /api/pets?type=dog&status=available
```

**Filter 2: Search for "Max"**
```
GET /api/pets?q=Max
```

**Filter 3: Small female cats**
```
GET /api/pets?type=cat&gender=female&size=small
```

**Filter 4: Senior dogs (sort by oldest)**
```
GET /api/pets?type=dog&ageRange=senior&sort=oldest
```

**Filter 5: Paginated results (page 2, 20 items per page)**
```
GET /api/pets?page=2&pageSize=20
```

---

### Test 3: Get Single Pet

**Endpoint:** `GET http://localhost:3001/api/pets/:id`

**Steps:**
1. Copy a pet `id` from Test 1 response
2. Create `GET` request to: `http://localhost:3001/api/pets/65abc123...`
3. Replace `65abc123...` with actual pet ID
4. Click **"Send"**

**Expected Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "65abc123...",
    "name": "Max",
    "type": "dog",
    "breed": "Golden Retriever",
    "age": 36,
    "ageDisplay": "3 years",
    "gender": "male",
    "size": "large",
    "color": "Golden",
    "weight": "32 kg",
    "vaccinated": true,
    "neutered": true,
    "status": "available",
    "description": "Friendly and energetic dog...",
    "personality": ["friendly", "energetic", "playful"],
    "images": ["https://res.cloudinary.com/..."],
    "location": "New York Shelter",
    "postedDate": "2026-03-01T10:00:00.000Z",
    "createdBy": "65admin..."
  },
  "message": "Pet retrieved successfully"
}
```

**❌ If Pet Not Found (404):**
```json
{
  "success": false,
  "message": "Pet not found",
  "statusCode": 404
}
```

---

### Test 4: Create New Pet (Admin Only)

**Endpoint:** `POST http://localhost:3001/api/pets`

**Prerequisites:**
1. Login as admin first to get access token
2. Copy the `accessToken` from login response

**Steps:**
1. Create new `POST` request to: `http://localhost:3001/api/pets`
2. Click **"Headers"** tab
3. Add header:
   - Key: `Authorization`
   - Value: `Bearer YOUR_ACCESS_TOKEN_HERE`
4. Click **"Body"** tab
5. Select **"raw"** and **"JSON"**
6. Paste this JSON:

```json
{
  "name": "Bella",
  "type": "cat",
  "breed": "Persian",
  "age": 24,
  "gender": "female",
  "size": "small",
  "color": "White",
  "weight": "4 kg",
  "vaccinated": true,
  "neutered": true,
  "status": "available",
  "description": "Beautiful and calm Persian cat looking for a loving home. Very friendly with children and other pets.",
  "personality": ["calm", "gentle", "affectionate", "playful"],
  "location": "Los Angeles Shelter",
  "images": [
    "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=500"
  ]
}
```

7. Click **"Send"**

**Expected Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "65def456...",
    "name": "Bella",
    "type": "cat",
    "breed": "Persian",
    "age": 24,
    "ageDisplay": "2 years",
    "gender": "female",
    "size": "small",
    "color": "White",
    "weight": "4 kg",
    "vaccinated": true,
    "neutered": true,
    "status": "available",
    "description": "Beautiful and calm Persian cat...",
    "personality": ["calm", "gentle", "affectionate", "playful"],
    "location": "Los Angeles Shelter",
    "images": ["https://images.unsplash.com/..."],
    "postedDate": "2026-03-05T16:30:00.000Z",
    "createdBy": "65admin123..."
  },
  "message": "Pet created successfully"
}
```

**✅ What Happened:**
- Pet saved to MongoDB
- ID generated automatically
- ageDisplay calculated from `age` (24 months = "2 years")
- Timestamps added (postedDate, createdAt, updatedAt)
- Will persist across page refreshes! 🎉

**❌ Error: Not Authenticated (401)**
```json
{
  "success": false,
  "message": "User not authenticated",
  "statusCode": 401
}
```
**Solution:** Add valid Authorization header with admin token

**❌ Error: Not Admin (403)**
```json
{
  "success": false,
  "message": "Access denied. Admin privileges required.",
  "statusCode": 403
}
```
**Solution:** Login as admin first

**❌ Error: Validation Error (400)**
```json
{
  "success": false,
  "message": "Validation error",
  "error": "[{\"code\":\"invalid_enum_value\",\"expected\":\"'dog' | 'cat'\",\"received\":\"'bird'\",\"path\":[\"type\"],\"message\":\"Invalid enum value. Expected 'dog' | 'cat'.\"}]",
  "statusCode": 400
}
```
**Solution:** Check all fields are valid (see schema below)

---

### Test 5: Update Pet (Admin Only)

**Endpoint:** `PATCH http://localhost:3001/api/pets/:id`

**Steps:**
1. Copy a pet ID to update
2. Create `PATCH` request to: `http://localhost:3001/api/pets/65def456...`
3. Add Authorization header with admin token
4. Click **"Body"** tab → **"raw"** → **"JSON"**
5. Paste partial update (any fields can be omitted):

**Example: Update status and description**
```json
{
  "status": "adopted",
  "description": "Previously available - now has a loving home!"
}
```

6. Click **"Send"**

**Expected Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "65def456...",
    "name": "Bella",
    "type": "cat",
    "breed": "Persian",
    "age": 24,
    "ageDisplay": "2 years",
    "status": "adopted",
    "description": "Previously available - now has a loving home!",
    // ... other fields unchanged
    "updatedAt": "2026-03-05T17:00:00.000Z"
  },
  "message": "Pet updated successfully"
}
```

**Advanced Updates:**

**Update multiple fields:**
```json
{
  "name": "Bella Updated",
  "age": 30,
  "weight": "4.5 kg",
  "personality": ["calm", "gentle", "affectionate", "playful", "curious"],
  "vaccinated": false,
  "images": [
    "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=500",
    "https://images.unsplash.com/photo-1573865526014-f3550beaae6e?w=500"
  ]
}
```

**✅ What Happens:**
- Only specified fields updated
- Other fields remain unchanged
- Validation still applied
- updatedAt timestamp updated
- Changes persist in database

---

### Test 6: Delete Pet (Admin Only)

**Endpoint:** `DELETE http://localhost:3001/api/pets/:id`

**Steps:**
1. Copy a pet ID to delete
2. Create `DELETE` request to: `http://localhost:3001/api/pets/65def456...`
3. Add Authorization header with admin token
4. **No body needed**
5. Click **"Send"**

**Expected Response (200 OK):**
```json
{
  "success": true,
  "data": null,
  "message": "Pet deleted successfully"
}
```

**❌ If Already Deleted (404):**
```json
{
  "success": false,
  "message": "Pet not found",
  "statusCode": 404
}
```

**✅ What Happens:**
- Pet permanently removed from database
- Will no longer appear in listings
- Any bookings for this pet may show as invalid

---

## 📝 Complete Request / Response Examples

### Full Admin Workflow

#### Step 1: Login as Admin
**Request:**
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@pawbuddy.com",
  "password": "admin123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "65admin123...",
      "name": "Admin User",
      "email": "admin@pawbuddy.com",
      "role": "admin"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "Login successful"
}
```

Save the `accessToken` for next requests.

#### Step 2: Create Pet
**Request:**
```bash
POST /api/pets
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "name": "Charlie",
  "type": "dog",
  "breed": "Labrador",
  "age": 48,
  "gender": "male",
  "size": "large",
  "color": "Black",
  "weight": "35 kg",
  "vaccinated": true,
  "neutered": true,
  "status": "available",
  "description": "Friendly and intelligent Labrador, perfect for families.",
  "personality": ["friendly", "intelligent", "loyal"],
  "location": "Chicago Shelter",
  "images": ["https://images.unsplash.com/photo-1633722715463-d30628519b48?w=500"]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "65ghi789...",
    "name": "Charlie",
    "type": "dog",
    "breed": "Labrador",
    "age": 48,
    "ageDisplay": "4 years",
    "gender": "male",
    "size": "large",
    "color": "Black",
    "weight": "35 kg",
    "vaccinated": true,
    "neutered": true,
    "status": "available",
    "description": "Friendly and intelligent Labrador...",
    "personality": ["friendly", "intelligent", "loyal"],
    "images": ["https://images.unsplash.com/..."],
    "location": "Chicago Shelter",
    "postedDate": "2026-03-05T17:30:00.000Z",
    "createdBy": "65admin123..."
  },
  "message": "Pet created successfully"
}
```

**Save the `id` (65ghi789...) for next requests.**

#### Step 3: Get All Pets (Verify Creation)
**Request:**
```bash
GET /api/pets?type=dog&pageSize=5
```

**Response includes newly created Charlie**

#### Step 4: Update Created Pet
**Request:**
```bash
PATCH /api/pets/65ghi789...
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "status": "pending",
  "description": "Charlie is pending adoption! A great family dog."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "65ghi789...",
    "name": "Charlie",
    "status": "pending",
    "description": "Charlie is pending adoption! A great family dog.",
    "updatedAt": "2026-03-05T18:00:00.000Z"
    // ... other fields
  },
  "message": "Pet updated successfully"
}
```

#### Step 5: Get Single Updated Pet
**Request:**
```bash
GET /api/pets/65ghi789...
```

**Response:** Shows updated pet with status="pending"

#### Step 6: Delete Pet
**Request:**
```bash
DELETE /api/pets/65ghi789...
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response:**
```json
{
  "success": true,
  "data": null,
  "message": "Pet deleted successfully"
}
```

---

## 🔍 Pet Schema Validation

When creating or updating pets, all fields must match this schema:

```typescript
{
  // Required fields
  name: string (1+ chars),              // Pet's name
  type: "dog" | "cat",                  // Must be dog or cat
  breed: string (1+ chars),             // Breed name
  age: number (0+),                     // Age in MONTHS
  gender: "male" | "female",            // Must be male or female
  size: "small" | "medium" | "large",   // Must be one of these
  color: string (1+ chars),             // Color/pattern
  weight: string (1+ chars),            // E.g., "32 kg", "15 lbs"
  location: string (1+ chars),          // Shelter/city location
  description: string (10+ chars),      // Detailed description
  
  // Optional fields (defaults provided)
  vaccinated: boolean (default: false),
  neutered: boolean (default: false),
  status: "available" | "pending" | "adopted" (default: "available"),
  personality: string[] (default: []),            // Array of traits
  images: string[] valid URLs (default: []),      // Array of image URLs
}
```

### Validation Rules:

| Field | Rule | Example |
|-------|------|---------|
| `name` | 1+ characters | "Max", "Bella" |
| `type` | Exactly "dog" or "cat" | `"dog"` ❌ `"puppy"` |
| `breed` | 1+ characters | "Golden Retriever" |
| `age` | Number, 0 or greater (in months) | `24` (for 2 years) ✅ |
| `gender` | Exactly "male" or "female" | `"male"` ❌ `"M"` |
| `size` | One of: small, medium, large | `"large"` ❌ `"xlarge"` |
| `color` | 1+ characters | "Golden", "Black and White" |
| `weight` | 1+ characters | "32 kg", "70 lbs" |
| `location` | 1+ characters | "New York Shelter" |
| `description` | 10+ characters | Min 10 chars required |
| `personality` | Array of strings | `["friendly", "playful"]` |
| `images` | Array of valid URLs | Must be proper URLs |
| `status` | One of: available, pending, adopted | `"available"` ❌ `"free"` |
| `vaccinated` | Boolean | `true` or `false` |
| `neutered` | Boolean | `true` or `false` |

### Age Conversion Reference:

| Months | Display | Example |
|--------|---------|---------|
| `6` | "6 months" | Baby puppy |
| `12` | "1 year" | 1-year-old |
| `24` | "2 years" | Young adult |
| `36` | "3 years" | Adult |
| `48` | "4 years" | Adult |
| `60` | "5 years" | Adult |
| `84` | "7 years" | Senior |
| `120` | "10 years" | Senior |

---

## ✅ Testing Checklist

### Authentication & Authorization
- [ ] Get pets without auth token (should work - public)
- [ ] Get pet by ID without auth token (should work - public)
- [ ] Create pet without auth token (should fail - 401)
- [ ] Create pet with adopter token (should fail - 403, not admin)
- [ ] Create pet with admin token (should work - 201)

### Create Operations
- [ ] Create valid pet (should succeed)
- [ ] Create pet with missing field (should fail - validation)
- [ ] Create pet with invalid enum value (should fail - validation)
- [ ] Create pet with short description (<10 chars) (should fail - validation)
- [ ] Create pet with invalid image URL (should fail - validation)

### Read Operations
- [ ] Get all pets (no filters) (should return first page)
- [ ] Get all pets with `?page=2` (should return page 2)
- [ ] Get all pets with `?type=dog` (should filter to dogs only)
- [ ] Get all pets with `?q=Max` (should search by name)
- [ ] Get all pets with `?status=available` (should filter by status)
- [ ] Get all pets with multiple filters (should apply all)
- [ ] Get single pet by valid ID (should return pet)
- [ ] Get single pet by invalid ID (should return 404)

### Update Operations
- [ ] Update pet with valid data (should succeed)
- [ ] Update pet with partial data (should update only provided fields)
- [ ] Update only status to "adopted" (should persist)
- [ ] Update with invalid enum (should fail - validation)
- [ ] Update non-existent pet (should return 404)

### Delete Operations
- [ ] Delete existing pet (should succeed)
- [ ] Get deleted pet (should return 404)
- [ ] Delete already deleted pet (should return 404)

### Pagination
- [ ] First request without page (should default to page 1)
- [ ] Request with `?pageSize=5` (should return max 5 items)
- [ ] Request with `?pageSize=100` (should return max 100)
- [ ] Request with `?pageSize=101` (should reject - max is 100)
- [ ] Response includes correct pagination metadata

### Persistence (The Key Test!)
- [ ] Create pet (receives ID)
- [ ] Refresh browser page
- [ ] Get all pets → **pet should still be there** ✅
- [ ] Get pet by ID → **should return saved pet** ✅
- [ ] This proves database persistence works!

---

## 🐛 Troubleshooting

### ❌ "Connection refused" on creation

**Cause:** Backend server not running

**Solution:**
```bash
npm run dev
```

---

### ❌ "User not authenticated" (401)

**Cause:** Authorization header missing or invalid

**Solution:**
1. Login first to get token
2. Copy the `accessToken` from response
3. Add header: `Authorization: Bearer YOUR_TOKEN`

---

### ❌ "Access denied. Admin privileges required" (403)

**Cause:** Using adopter account instead of admin

**Solution:** Login as admin
```json
{
  "email": "admin@pawbuddy.com",
  "password": "admin123"
}
```

---

### ❌ "Validation error" (400)

**Cause:** Invalid field values

**Common issues:**
- `type` not "dog" or "cat"
- `gender` not "male" or "female"
- `size` not "small", "medium", or "large"
- `status` not "available", "pending", or "adopted"
- `description` less than 10 characters
- `age` is negative
- `images` not valid URLs

**Solution:** Check validation schema and fix values

---

### ❌ "Pet not found" (404)

**Cause:** Invalid pet ID or pet was deleted

**Solution:**
1. Get all pets to find valid IDs
2. Use correct ID in request

---

## 🚀 Frontend Integration

### React Example: Add Pet

```javascript
// Step 1: Login to get token
const loginResponse = await fetch('http://localhost:3001/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'admin@pawbuddy.com',
    password: 'admin123'
  })
});
const { data } = await loginResponse.json();
const accessToken = data.accessToken;

// Step 2: Create pet with form data
const petData = {
  name: 'Buddy',
  type: 'dog',
  breed: 'Mixed',
  age: 24,
  gender: 'male',
  size: 'medium',
  color: 'Brown',
  weight: '25 kg',
  vaccinated: true,
  neutered: true,
  status: 'available',
  description: 'Friendly mixed breed dog looking for a home!',
  personality: ['friendly', 'energetic'],
  location: 'Local Shelter',
  images: ['https://...']
};

const createResponse = await fetch('http://localhost:3001/api/pets', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${accessToken}`
  },
  body: JSON.stringify(petData)
});

const newPet = await createResponse.json();
console.log('Pet created:', newPet.data.id);

// Step 3: Refresh page and fetch all pets
const petsResponse = await fetch('http://localhost:3001/api/pets');
const pets = await petsResponse.json();
console.log('All pets (persisted):', pets.data.items);
// Output will include the newly created pet! ✅
```

### React Example: Get All Pets

```javascript
// Fetch available dogs
const response = await fetch(
  'http://localhost:3001/api/pets?type=dog&status=available&pageSize=10'
);
const { data } = await response.json();
console.log('Available dogs:', data.items);
console.log('Total:', data.pagination.total);
```

---

## 📞 Summary

✅ **All pet operations are fully implemented and tested:**
- Pet creation with full persistence
- Retrieval with advanced filtering & sorting
- Updates with validation
- Deletion from database
- Pagination support
- Authentication & authorization
- Complete error handling

**Everything survives page refresh!** 🎉

---

**Backend Status: PRODUCTION READY** ✅

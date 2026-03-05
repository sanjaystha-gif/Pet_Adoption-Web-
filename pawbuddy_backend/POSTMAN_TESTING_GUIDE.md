# 📬 Complete Postman Testing Guide - PawBuddy API

**Step-by-Step Instructions for Testing All 26 API Endpoints**

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Initial Setup](#initial-setup)
3. [Testing Authentication APIs](#testing-authentication-apis)
4. [Testing Pet APIs](#testing-pet-apis)
5. [Testing Booking APIs](#testing-booking-apis)
6. [Testing Favourite APIs](#testing-favourite-apis)
7. [Testing Upload APIs](#testing-upload-apis)
8. [Testing Admin APIs](#testing-admin-apis)
9. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### 1. Install Postman
- Download from: https://www.postman.com/downloads/
- Install and create a free account (optional)

### 2. Start Backend Server
```bash
# Terminal 1 - In backend directory
npm run dev
```

You should see:
```
✅ Connected to MongoDB
✅ Server is running on port 3001
📚 API Documentation: http://localhost:3001/api-docs
```

### 3. Seed Database (Optional but Recommended)
```bash
# Terminal 2 - In backend directory
npm run seed
```

This creates:
- 1 Admin user: `admin@pawbuddy.com` / `admin123`
- 2 Adopter users: `john@example.com` / `adopter123`, `sarah@example.com` / `adopter123`
- 10+ sample pets
- Sample bookings and favourites

---

## Initial Setup

### Step 1: Import Collection

1. Open Postman
2. Click **"Import"** button (top left)
3. Click **"Choose Files"**
4. Navigate to your backend folder
5. Select `postman_collection.json`
6. Click **"Import"**

You should see **"PawBuddy - Pet Adoption API"** collection in left sidebar with 6 folders:
- Auth (6 requests)
- Pets (5 requests)
- Bookings (5 requests)
- Favourites (3 requests)
- Upload (3 requests)
- Admin (4 requests)

### Step 2: Import Environment

1. Click **"Import"** button again
2. Select `postman_environment.json`
3. Click **"Import"**
4. In top right, select **"PawBuddy Environment"** from dropdown

### Step 3: Verify Environment Variables

1. Click the eye icon (👁️) next to environment dropdown
2. You should see these variables:
   - `baseUrl`: `http://localhost:3001`
   - `accessToken`: (empty initially)
   - `refreshToken`: (empty initially)
   - `userId`: (empty initially)
   - `petId`: (empty initially)
   - `bookingId`: (empty initially)

---

## Testing Authentication APIs

### 🔹 Test 1: Register New User

**Endpoint:** `POST /api/auth/register`

**Steps:**
1. Expand **"Auth"** folder in collection
2. Click **"Register"**
3. Click **"Body"** tab
4. You'll see JSON (you can modify):
   ```json
   {
     "name": "John Doe",
     "email": "johndoe@example.com",
     "password": "password123",
     "role": "adopter"
   }
   ```
5. **Important:** Change the email to something unique (e.g., `johndoe2@example.com`)
6. Click **"Send"**

**Expected Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "65abc123...",
      "name": "John Doe",
      "email": "johndoe2@example.com",
      "role": "adopter"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "User registered successfully"
}
```

**✅ What Happened:**
- User created in database
- Password hashed with bcrypt
- JWT tokens generated
- `accessToken` and `refreshToken` automatically saved to environment variables
- `userId` saved to environment

---

### 🔹 Test 2: Login with Existing User

**Endpoint:** `POST /api/auth/login`

**Steps:**
1. Click **"Login"** in Auth folder
2. Click **"Body"** tab
3. Use seeded user credentials:
   ```json
   {
     "email": "john@example.com",
     "password": "adopter123"
   }
   ```
4. Click **"Send"**

**Expected Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "65abc...",
      "name": "John Smith",
      "email": "john@example.com",
      "role": "adopter"
    },
    "accessToken": "eyJhbGci...",
    "refreshToken": "eyJhbGci..."
  },
  "message": "Login successful"
}
```

**✅ Tokens Updated:**
- Check environment variables (👁️ icon) - tokens should be updated

---

### 🔹 Test 3: Get Current User Profile

**Endpoint:** `GET /api/auth/me`

**Steps:**
1. Click **"Get Profile"** in Auth folder
2. Click **"Headers"** tab
3. Notice `Authorization: Bearer {{accessToken}}` is already added
4. Click **"Send"**

**Expected Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "65abc...",
    "name": "John Smith",
    "email": "john@example.com",
    "role": "adopter",
    "avatar": null,
    "phone": "+1234567890",
    "bio": "Love all animals!",
    "city": "New York",
    "joinedDate": "2026-03-01T10:00:00.000Z"
  },
  "message": "User profile retrieved"
}
```

**✅ Authentication Working:**
- JWT token validated
- User data retrieved from database

---

### 🔹 Test 4: Refresh Access Token

**Endpoint:** `POST /api/auth/refresh`

**Steps:**
1. Click **"Refresh Token"** in Auth folder
2. Click **"Body"** tab - you'll see:
   ```json
   {
     "refreshToken": "{{refreshToken}}"
   }
   ```
3. Click **"Send"**

**Expected Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGci...(new token)",
    "refreshToken": "eyJhbGci...(new token)"
  },
  "message": "Token refreshed successfully"
}
```

**✅ Token Rotation:**
- Old refresh token invalidated
- New tokens generated and saved

---

### 🔹 Test 5: Change Password

**Endpoint:** `POST /api/auth/change-password`

**Steps:**
1. Click **"Change Password"** in Auth folder
2. Make sure you're logged in (access token set)
3. Click **"Body"** tab:
   ```json
   {
     "currentPassword": "adopter123",
     "newPassword": "newpassword123"
   }
   ```
4. Click **"Send"**

**Expected Response (200 OK):**
```json
{
  "success": true,
  "data": null,
  "message": "Password changed successfully. Please login again."
}
```

**✅ Password Changed:**
- All refresh tokens revoked for security
- Need to login again with new password

---

### 🔹 Test 6: Logout

**Endpoint:** `POST /api/auth/logout`

**Steps:**
1. Login again first if you changed password
2. Click **"Logout"** in Auth folder
3. Click **"Send"**

**Expected Response (200 OK):**
```json
{
  "success": true,
  "data": null,
  "message": "Logout successful"
}
```

**✅ Logged Out:**
- All refresh tokens deleted from database
- Access token still valid until expiry (15 minutes)

---

## Testing Pet APIs

**🔑 Note:** Login as adopter or admin before testing these endpoints.

### 🔹 Test 7: Get All Pets (with Filtering)

**Endpoint:** `GET /api/pets`

**Steps:**
1. Click **"Get All Pets"** in Pets folder
2. This is a public endpoint (no auth required)
3. Click **"Params"** tab to see available filters:
   - `page`: 1
   - `pageSize`: 10
   - `q`: (search term)
   - `type`: dog/cat
   - `breed`: (breed name)
   - `gender`: male/female
   - `size`: small/medium/large
   - `status`: available/pending/adopted
   - `color`: (color name)
   - `location`: (location name)
   - `ageRange`: baby/young/adult/senior
   - `sort`: newest/oldest/name-asc/name-desc

**Try Different Filters:**

**Example 1 - Get available dogs:**
```
/api/pets?type=dog&status=available&page=1&pageSize=10
```

**Example 2 - Search by name:**
```
/api/pets?q=Max&pageSize=5
```

**Example 3 - Get small female cats:**
```
/api/pets?type=cat&gender=female&size=small
```

4. Click **"Send"**

**Expected Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "65abc...",
        "name": "Max",
        "type": "dog",
        "breed": "Golden Retriever",
        "age": 36,
        "ageDisplay": "3 years",
        "gender": "male",
        "size": "large",
        "color": "Golden",
        "description": "Friendly and energetic dog...",
        "temperament": ["friendly", "energetic", "playful"],
        "healthStatus": "Vaccinated, neutered",
        "location": "New York Shelter",
        "images": ["https://res.cloudinary.com/..."],
        "status": "available",
        "postedDate": "2026-03-01T10:00:00.000Z"
      }
      // ... more pets
    ],
    "pagination": {
      "page": 1,
      "pageSize": 10,
      "total": 15,
      "totalPages": 2
    }
  },
  "message": "Pets retrieved successfully"
}
```

**✅ Filtering Works:**
- Pagination applied
- Search and filters work
- Age calculated in months and displayed as string

---

### 🔹 Test 8: Get Single Pet by ID

**Endpoint:** `GET /api/pets/:id`

**Steps:**
1. **First, copy a pet ID** from previous response
2. Click **"Get Pet by ID"** in Pets folder
3. Click **"Params"** tab
4. Replace `:id` with actual pet ID (or it uses `{{petId}}` variable)
5. Click **"Send"**

**Expected Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "65abc...",
    "name": "Max",
    "type": "dog",
    "breed": "Golden Retriever",
    // ... full pet details
  },
  "message": "Pet retrieved successfully"
}
```

---

### 🔹 Test 9: Create New Pet (Admin Only)

**Endpoint:** `POST /api/pets`

**Steps:**
1. **Login as admin first:**
   - Email: `admin@pawbuddy.com`
   - Password: `admin123`
2. Click **"Create Pet"** in Pets folder
3. Click **"Body"** tab:
   ```json
   {
     "name": "Bella",
     "type": "cat",
     "breed": "Persian",
     "age": 24,
     "gender": "female",
     "size": "small",
     "color": "White",
     "description": "Beautiful and calm Persian cat looking for a loving home.",
     "temperament": ["calm", "gentle", "affectionate"],
     "healthStatus": "Vaccinated, spayed, microchipped",
     "location": "Los Angeles Shelter",
     "images": [
       "https://res.cloudinary.com/demo/image/upload/sample.jpg"
     ],
     "status": "available"
   }
   ```
4. Click **"Send"**

**Expected Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "65def...",
    "name": "Bella",
    "type": "cat",
    "breed": "Persian",
    "age": 24,
    "ageDisplay": "2 years",
    // ... full pet data
  },
  "message": "Pet created successfully"
}
```

**❌ If you're not admin:**
```json
{
  "success": false,
  "message": "Access denied. Admin privileges required.",
  "statusCode": 403
}
```

---

### 🔹 Test 10: Update Pet (Admin Only)

**Endpoint:** `PATCH /api/pets/:id`

**Steps:**
1. Make sure you're logged in as admin
2. Copy a pet ID
3. Click **"Update Pet"** in Pets folder
4. Update the URL with pet ID
5. Click **"Body"** tab (you can update any fields):
   ```json
   {
     "name": "Max Updated",
     "status": "adopted",
     "description": "This pet has been adopted!"
   }
   ```
6. Click **"Send"**

**Expected Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "65abc...",
    "name": "Max Updated",
    "status": "adopted",
    // ... updated pet data
  },
  "message": "Pet updated successfully"
}
```

---

### 🔹 Test 11: Delete Pet (Admin Only)

**Endpoint:** `DELETE /api/pets/:id`

**Steps:**
1. Make sure you're logged in as admin
2. Copy a pet ID to delete
3. Click **"Delete Pet"** in Pets folder
4. Update URL with pet ID
5. Click **"Send"**

**Expected Response (200 OK):**
```json
{
  "success": true,
  "data": null,
  "message": "Pet deleted successfully"
}
```

---

## Testing Booking APIs

**🔑 Login as adopter** before testing these endpoints.

### 🔹 Test 12: Create Booking (Adoption Request)

**Endpoint:** `POST /api/bookings`

**Steps:**
1. Login as adopter: `john@example.com` / `adopter123` (or new password)
2. Copy a pet ID from available pets
3. Click **"Create Booking"** in Bookings folder
4. Click **"Body"** tab:
   ```json
   {
     "petId": "65abc12345...",
     "message": "I would love to adopt this pet! I have experience with pets and a great home.",
     "homeType": "house",
     "yardStatus": "fenced",
     "workSchedule": "9-5 with flexible lunch breaks",
     "currentPets": "1 dog",
     "petExperience": "10+ years",
     "lifetimeCommitment": true
   }
   ```
5. Replace `petId` with actual pet ID
6. Click **"Send"**

**Expected Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "65booking...",
    "petId": "65abc...",
    "petName": "Max",
    "petImage": "https://...",
    "adopterId": "65user...",
    "adopterName": "John Smith",
    "adopterEmail": "john@example.com",
    "adopterPhone": "+1234567890",
    "message": "I would love to adopt...",
    "homeType": "house",
    "yardStatus": "fenced",
    "workSchedule": "9-5...",
    "currentPets": "1 dog",
    "petExperience": "10+ years",
    "lifetimeCommitment": true,
    "status": "pending",
    "submittedAt": "2026-03-05T15:30:00.000Z"
  },
  "message": "Booking created successfully"
}
```

**✅ Booking Created:**
- Pet status updated to "pending"
- Booking ID saved to environment variables
- Can't create duplicate booking for same pet

---

### 🔹 Test 13: Get My Bookings

**Endpoint:** `GET /api/bookings/me`

**Steps:**
1. Make sure you're logged in as adopter
2. Click **"Get My Bookings"** in Bookings folder
3. Click **"Params"** tab to add filters:
   - `page`: 1
   - `pageSize`: 10
   - `status`: pending/approved/rejected
4. Click **"Send"**

**Expected Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "65booking...",
        "petId": "65abc...",
        "petName": "Max",
        "petImage": "https://...",
        "status": "pending",
        "submittedAt": "2026-03-05T15:30:00.000Z"
        // ... full booking details
      }
    ],
    "pagination": {
      "page": 1,
      "pageSize": 10,
      "total": 3,
      "totalPages": 1
    }
  },
  "message": "Bookings retrieved successfully"
}
```

---

### 🔹 Test 14: Cancel Booking

**Endpoint:** `DELETE /api/bookings/:id`

**Steps:**
1. Copy a booking ID from your bookings
2. Click **"Cancel Booking"** in Bookings folder
3. Update URL with booking ID
4. Click **"Send"**

**Expected Response (200 OK):**
```json
{
  "success": true,
  "data": null,
  "message": "Booking cancelled successfully"
}
```

**✅ Booking Cancelled:**
- Booking deleted from database
- Pet status reverted to "available"

---

### 🔹 Test 15: Get All Bookings (Admin Only)

**Endpoint:** `GET /api/bookings/admin/all`

**Steps:**
1. **Login as admin:** `admin@pawbuddy.com` / `admin123`
2. Click **"Get All Bookings (Admin)"** in Bookings folder
3. Click **"Params"** to add filters:
   - `page`: 1
   - `pageSize`: 20
   - `status`: pending/approved/rejected
4. Click **"Send"**

**Expected Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "65booking...",
        "petName": "Max",
        "adopterName": "John Smith",
        "adopterEmail": "john@example.com",
        "status": "pending",
        "submittedAt": "2026-03-05T15:30:00.000Z"
        // ... all fields
      }
      // ... all bookings from all users
    ],
    "pagination": {
      "page": 1,
      "pageSize": 20,
      "total": 25,
      "totalPages": 2
    }
  },
  "message": "All bookings retrieved successfully"
}
```

---

### 🔹 Test 16: Update Booking Status (Admin Only)

**Endpoint:** `PATCH /api/bookings/admin/:id/status`

**Steps:**
1. Make sure you're logged in as admin
2. Copy a booking ID
3. Click **"Update Booking Status"** in Bookings folder
4. Update URL with booking ID
5. Click **"Body"** tab:
   ```json
   {
     "status": "approved",
     "notes": "Congratulations! Your adoption request has been approved."
   }
   ```
6. Click **"Send"**

**Expected Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "65booking...",
    "status": "approved",
    "statusUpdatedAt": "2026-03-05T16:00:00.000Z",
    "notes": "Congratulations!..."
    // ... full booking data
  },
  "message": "Booking status updated successfully"
}
```

**✅ Status Updated:**
- If status is "approved", pet status becomes "adopted"
- If status is "rejected", pet status becomes "available"

---

## Testing Favourite APIs

**🔑 Login as adopter** before testing.

### 🔹 Test 17: Get My Favourites

**Endpoint:** `GET /api/favourites/me`

**Steps:**
1. Login as adopter
2. Click **"Get My Favourites"** in Favourites folder
3. Click **"Send"**

**Expected Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "65fav...",
      "userId": "65user...",
      "petId": "65pet...",
      "pet": {
        "id": "65pet...",
        "name": "Max",
        "type": "dog",
        "breed": "Golden Retriever",
        "age": 36,
        "ageDisplay": "3 years",
        "images": ["https://..."],
        "status": "available"
        // ... full pet details
      },
      "createdAt": "2026-03-05T10:00:00.000Z"
    }
  ],
  "message": "Favourites retrieved successfully"
}
```

---

### 🔹 Test 18: Add Pet to Favourites

**Endpoint:** `POST /api/favourites/:petId`

**Steps:**
1. Copy a pet ID you want to favourite
2. Click **"Add Favourite"** in Favourites folder
3. Update URL with pet ID: `/api/favourites/65abc...`
4. Click **"Send"**

**Expected Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "65fav...",
    "userId": "65user...",
    "petId": "65pet...",
    "pet": {
      "id": "65pet...",
      "name": "Bella",
      "type": "cat"
      // ... full pet details
    },
    "createdAt": "2026-03-05T16:30:00.000Z"
  },
  "message": "Pet added to favourites"
}
```

**❌ If already favourited:**
```json
{
  "success": false,
  "message": "Pet already in favourites",
  "statusCode": 400
}
```

---

### 🔹 Test 19: Remove from Favourites

**Endpoint:** `DELETE /api/favourites/:petId`

**Steps:**
1. Copy a pet ID from your favourites
2. Click **"Remove Favourite"** in Favourites folder
3. Update URL with pet ID
4. Click **"Send"**

**Expected Response (200 OK):**
```json
{
  "success": true,
  "data": null,
  "message": "Pet removed from favourites"
}
```

---

## Testing Upload APIs

**🔑 Login required** (adopter or admin).

### 🔹 Test 20: Upload Single Image

**Endpoint:** `POST /api/upload/single`

**Steps:**
1. Login first (adopter or admin)
2. Click **"Upload Single Image"** in Upload folder
3. Click **"Body"** tab
4. Select **"form-data"** (should be selected)
5. You'll see a key `image` with type `File`
6. Click **"Select Files"** next to `image`
7. Choose an image from your computer (jpg, png, gif - max 5MB)
8. Optionally add query param `folder` (default: pawbuddy)
9. Click **"Send"**

**Expected Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "imageUrl": "https://res.cloudinary.com/dthfai8ky/image/upload/v1234567890/pawbuddy/abc123.jpg",
    "publicId": "pawbuddy/abc123"
  },
  "message": "Image uploaded successfully"
}
```

**✅ Image Uploaded:**
- Uploaded to Cloudinary
- Auto-resized to max 1200x1200
- Quality optimized
- Copy `imageUrl` to use in pet creation

---

### 🔹 Test 21: Upload Multiple Images

**Endpoint:** `POST /api/upload/multiple`

**Steps:**
1. Click **"Upload Multiple Images"** in Upload folder
2. Click **"Body"** tab → **"form-data"**
3. You'll see key `images` (note the 's' - plural)
4. Click **"Select Files"**
5. **Select multiple images** (max 5 images)
6. Click **"Send"**

**Expected Response (201 Created):**
```json
{
  "success": true,
  "data": [
    {
      "imageUrl": "https://res.cloudinary.com/.../image1.jpg",
      "publicId": "pawbuddy/abc123"
    },
    {
      "imageUrl": "https://res.cloudinary.com/.../image2.jpg",
      "publicId": "pawbuddy/def456"
    },
    {
      "imageUrl": "https://res.cloudinary.com/.../image3.jpg",
      "publicId": "pawbuddy/ghi789"
    }
  ],
  "message": "Images uploaded successfully"
}
```

**✅ Multiple Images Uploaded:**
- All uploaded in parallel
- Can use for pet with multiple images

---

### 🔹 Test 22: Delete Image from Cloudinary

**Endpoint:** `DELETE /api/upload/delete`

**Steps:**
1. Copy a `publicId` from previous uploads (e.g., "pawbuddy/abc123")
2. Click **"Delete Image"** in Upload folder
3. Click **"Body"** tab:
   ```json
   {
     "publicId": "pawbuddy/abc123"
   }
   ```
4. Click **"Send"**

**Expected Response (200 OK):**
```json
{
  "success": true,
  "data": null,
  "message": "Image deleted successfully"
}
```

**✅ Image Deleted:**
- Permanently removed from Cloudinary
- Cannot be recovered

---

## Testing Admin APIs

**🔑 Login as admin** before testing.

### 🔹 Test 23: Get Dashboard Statistics

**Endpoint:** `GET /api/admin/stats`

**Steps:**
1. **Login as admin:** `admin@pawbuddy.com` / `admin123`
2. Click **"Get Dashboard Stats"** in Admin folder
3. Click **"Send"**

**Expected Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "overview": {
      "totalUsers": 5,
      "totalPets": 15,
      "totalBookings": 8,
      "adoptedPets": 3,
      "pendingBookings": 2,
      "availablePets": 12
    },
    "petDistribution": [
      { "type": "dog", "count": 8 },
      { "type": "cat", "count": 7 }
    ],
    "bookingDistribution": [
      { "status": "pending", "count": 2 },
      { "status": "approved", "count": 3 },
      { "status": "rejected", "count": 3 }
    ],
    "recentBookings": [
      {
        "id": "65booking...",
        "petName": "Max",
        "adopterName": "John Smith",
        "status": "pending",
        "submittedAt": "2026-03-05T15:30:00.000Z"
      }
      // ... 4 more recent bookings
    ]
  },
  "message": "Dashboard statistics retrieved successfully"
}
```

**✅ Dashboard Stats:**
- Real-time counts from database
- Pet distribution by type
- Booking distribution by status
- 5 most recent bookings

---

### 🔹 Test 24: Get All Users (Admin Only)

**Endpoint:** `GET /api/admin/users`

**Steps:**
1. Make sure you're logged in as admin
2. Click **"Get All Users"** in Admin folder
3. Click **"Params"** to add filters:
   - `page`: 1
   - `pageSize`: 10
   - `q`: (search by name or email)
   - `role`: admin/adopter
4. Click **"Send"**

**Expected Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "65user...",
        "name": "Admin User",
        "email": "admin@pawbuddy.com",
        "role": "admin",
        "avatar": null,
        "phone": "+1234567890",
        "bio": null,
        "city": "San Francisco",
        "joinedDate": "2026-03-01T10:00:00.000Z"
      },
      {
        "id": "65user2...",
        "name": "John Smith",
        "email": "john@example.com",
        "role": "adopter"
        // ... full user data
      }
      // ... more users
    ],
    "pagination": {
      "page": 1,
      "pageSize": 10,
      "total": 5,
      "totalPages": 1
    }
  },
  "message": "Users retrieved successfully"
}
```

---

### 🔹 Test 25: Update User Role (Admin Only)

**Endpoint:** `PATCH /api/admin/users/:id/role`

**Steps:**
1. Copy a user ID
2. Click **"Update User Role"** in Admin folder
3. Update URL with user ID
4. Click **"Body"** tab:
   ```json
   {
     "role": "admin"
   }
   ```
5. Click **"Send"**

**Expected Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "65user...",
    "name": "John Smith",
    "email": "john@example.com",
    "role": "admin"
    // ... full user data
  },
  "message": "User role updated successfully"
}
```

**✅ Role Updated:**
- User now has admin privileges
- Can access admin-only endpoints

---

### 🔹 Test 26: Update Own Profile

**Endpoint:** `PATCH /api/admin/profile`

**Steps:**
1. Login as any user (adopter or admin)
2. Click **"Update Profile"** in Admin folder
3. Click **"Body"** tab (update any fields):
   ```json
   {
     "name": "John Updated",
     "phone": "+1987654321",
     "bio": "Updated bio - I love dogs and cats!",
     "city": "Los Angeles",
     "avatar": "https://res.cloudinary.com/.../avatar.jpg"
   }
   ```
4. Click **"Send"**

**Expected Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "65user...",
    "name": "John Updated",
    "email": "john@example.com",
    "role": "adopter",
    "avatar": "https://res.cloudinary.com/.../avatar.jpg",
    "phone": "+1987654321",
    "bio": "Updated bio...",
    "city": "Los Angeles",
    "joinedDate": "2026-03-01T10:00:00.000Z"
  },
  "message": "Profile updated successfully"
}
```

---

## Troubleshooting

### ❌ Error: "User not authenticated" (401)

**Cause:** Access token expired or not set

**Solution:**
1. Check environment variables (👁️ icon)
2. If `accessToken` is empty, login again
3. If token expired (after 15 min), use "Refresh Token" request
4. After successful login, token auto-saves

---

### ❌ Error: "Access denied. Admin privileges required" (403)

**Cause:** Trying to access admin endpoint as adopter

**Solution:**
1. Logout current user
2. Login as admin: `admin@pawbuddy.com` / `admin123`
3. Try request again

---

### ❌ Error: "Connection refused" or "Network Error"

**Cause:** Backend server not running

**Solution:**
```bash
# Start server
npm run dev

# Check it's running on correct port
# Look for: ✅ Server is running on port 3001
```

---

### ❌ Error: "Validation error" (400)

**Cause:** Invalid request body or missing required fields

**Solution:**
1. Check response `error` field for details
2. Verify all required fields are present
3. Check data types (string vs number, etc.)
4. Check enum values (e.g., type must be "dog" or "cat")

---

### ❌ Error: "Pet not found" / "User not found" (404)

**Cause:** Invalid ID or resource doesn't exist

**Solution:**
1. Verify ID is correct
2. Run `npm run seed` to populate database
3. Get valid IDs from "Get All" endpoints first

---

### ❌ Error: "Only image files are allowed"

**Cause:** Trying to upload non-image file

**Solution:**
- Upload only: .jpg, .jpeg, .png, .gif, .webp
- Check file size < 5MB

---

### ❌ Error: "Pet already in favourites" (400)

**Cause:** Trying to add duplicate favourite

**Solution:**
- This is expected behavior
- Can't favourite same pet twice
- Use "Remove Favourite" then add again

---

## 📊 Testing Checklist

### Authentication ✅
- [ ] Register new user
- [ ] Login existing user  
- [ ] Get profile
- [ ] Refresh token
- [ ] Change password
- [ ] Logout

### Pets ✅
- [ ] Get all pets (no auth)
- [ ] Get all pets with filters
- [ ] Get pet by ID
- [ ] Create pet (admin)
- [ ] Update pet (admin)
- [ ] Delete pet (admin)

### Bookings ✅
- [ ] Create booking (adopter)
- [ ] Get my bookings
- [ ] Cancel booking
- [ ] Get all bookings (admin)
- [ ] Update booking status (admin)

### Favourites ✅
- [ ] Get my favourites
- [ ] Add to favourites
- [ ] Remove from favourites

### Upload ✅
- [ ] Upload single image
- [ ] Upload multiple images
- [ ] Delete image

### Admin ✅
- [ ] Get dashboard stats
- [ ] Get all users
- [ ] Update user role
- [ ] Update own profile

---

## 🎯 Test Scenarios

### Scenario 1: Complete Adoption Flow

1. **Register as adopter** → get tokens
2. **Browse pets** → find available dog
3. **View pet details** → get full info
4. **Add to favourites** → save for later
5. **Create booking** → submit adoption request
6. **Login as admin** → switch user
7. **View all bookings** → see pending requests
8. **Approve booking** → accept adoption
9. **Verify pet status** → should be "adopted"
10. **Login as adopter** → switch back
11. **Check my bookings** → see approved status

---

### Scenario 2: Pet Management (Admin)

1. **Login as admin**
2. **Upload images** → get URLs
3. **Create new pet** → use uploaded images
4. **View all pets** → verify created
5. **Update pet** → change description
6. **Get dashboard stats** → see updated counts
7. **View all users** → see who registered
8. **Make user admin** → promote user

---

### Scenario 3: User Journey

1. **Register new account**
2. **Get profile** → verify data
3. **Update profile** → add phone, bio, city
4. **Change password** → security
5. **Logout**
6. **Login with new password**
7. **Browse pets** → search and filter
8. **Favourite multiple pets**
9. **Create booking** → adoption request
10. **View my bookings** → track status

---

## 📝 Notes

- **Access Token Expiry:** 15 minutes (then refresh needed)
- **Refresh Token Expiry:** 7 days (then must login again)
- **File Upload Limit:** 5MB per image, max 5 images
- **Rate Limiting:** 100 requests per 15 min per IP
- **Auth Rate Limit:** 5 auth attempts per 15 min per IP

---

## 🚀 Next Steps

1. ✅ Complete all 26 tests in checklist
2. ✅ Try different filter combinations
3. ✅ Test error scenarios (invalid data, missing auth, etc.)
4. ✅ Test as both admin and adopter roles
5. ✅ Upload real images for pets
6. ✅ Create multiple bookings
7. ✅ Export working collection with your data

---

## 📞 Support

If you encounter issues:
1. Check server is running: `npm run dev`
2. Verify database connected (see console logs)
3. Check environment variables in Postman
4. Review error messages in response
5. Check server logs in terminal

**API Documentation:** http://localhost:3001/api-docs

---

**Happy Testing! 🎉**

*All 26 endpoints are production-ready and fully functional.*

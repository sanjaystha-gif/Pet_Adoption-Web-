# 🔗 Connect Your Existing Frontend

Your backend is now running on **http://localhost:3001/api**

## ✅ What's Ready:
- ✅ Backend server running on port 3001
- ✅ MongoDB connected with sample data
- ✅ 10 pets created (dogs & cats)
- ✅ 3 users: 1 admin + 2 adopters
- ✅ Sample bookings and favorites

---

## 🔐 Test Login Credentials:

**Admin Account:**
```
Email: admin@pawbuddy.com
Password: admin123
```

**Adopter Accounts:**
```
Email: john@example.com
Password: adopter123

Email: sarah@example.com
Password: adopter123
```

---

## 🔌 Connect Your Frontend:

### 1. Update API Base URL in Your Frontend

**If using React with .env:**
```env
VITE_API_URL=http://localhost:3001/api
# or
REACT_APP_API_URL=http://localhost:3001/api
```

**If directly in code:**
```typescript
const API_BASE_URL = 'http://localhost:3001/api';
```

---

## 📡 Available Endpoints:

### Authentication
```
POST /api/auth/register - Register new user
POST /api/auth/login - Login (returns accessToken + refreshToken)
POST /api/auth/refresh - Refresh access token
GET  /api/auth/me - Get current user (requires token)
POST /api/auth/logout - Logout
```

### Pets
```
GET    /api/pets - Get all pets (with filters)
GET    /api/pets/:id - Get single pet
POST   /api/pets - Create pet (admin only)
PATCH  /api/pets/:id - Update pet (admin only)
DELETE /api/pets/:id - Delete pet (admin only)
```

### Bookings (Adoption Requests)
```
POST   /api/bookings - Create booking
GET    /api/bookings/me - Get my bookings
DELETE /api/bookings/:id - Cancel booking
GET    /api/bookings/admin/all - Get all bookings (admin)
PATCH  /api/bookings/admin/:id/status - Update status (admin)
```

### Favourites
```
GET    /api/favourites/me - Get my favourites
POST   /api/favourites/:petId - Add favourite
DELETE /api/favourites/:petId - Remove favourite
```

### Admin
```
GET   /api/admin/users - Get all users (admin)
PATCH /api/admin/users/:id/role - Update user role (admin)
PATCH /api/admin/profile - Update own profile
```

---

## 🔑 Authentication Flow:

### 1. Login Request:
```typescript
const response = await fetch('http://localhost:3001/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'john@example.com',
    password: 'adopter123'
  })
});

const data = await response.json();
// { success: true, data: { accessToken, refreshToken, user } }
```

### 2. Store Tokens:
```typescript
localStorage.setItem('accessToken', data.data.accessToken);
localStorage.setItem('refreshToken', data.data.refreshToken);
```

### 3. Use Token in Requests:
```typescript
const response = await fetch('http://localhost:3001/api/pets', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
  }
});
```

---

## 📦 Response Format:

All responses follow this format:

**Success:**
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

**Error:**
```json
{
  "success": false,
  "error": "Error type",
  "message": "Error description"
}
```

**Paginated:**
```json
{
  "success": true,
  "data": {
    "items": [...],
    "pagination": {
      "page": 1,
      "pageSize": 10,
      "total": 100,
      "totalPages": 10
    }
  }
}
```

---

## 🔍 Get Pets with Filters:

```typescript
// Get all dogs
GET /api/pets?type=dog

// Get available cats
GET /api/pets?type=cat&status=available

// Get young pets in New York
GET /api/pets?ageRange=young&location=New York

// Sort by newest
GET /api/pets?sort=newest

// Pagination
GET /api/pets?page=1&pageSize=10
```

**Available Filters:**
- `type`: dog | cat
- `breed`: Golden Retriever, Persian, etc.
- `gender`: male | female
- `size`: small | medium | large
- `status`: available | pending | adopted
- `color`: Black, White, Brown, etc.
- `location`: City name
- `ageRange`: baby | young | adult | senior
- `sort`: newest | oldest | name-asc | name-desc
- `page`: Page number (default: 1)
- `pageSize`: Items per page (default: 10)

---

## 🐕 Pet Data Structure:

```typescript
interface Pet {
  id: string;
  name: string;
  type: 'dog' | 'cat';
  breed: string;
  age: number;              // Age in MONTHS
  ageDisplay: string;       // "8 months", "2 years", etc.
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
  postedDate: string;       // ISO date
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}
```

---

## 📝 Create Booking (Adoption Request):

```typescript
POST /api/bookings
Authorization: Bearer <token>

{
  "petId": "65abc123...",
  "message": "I want to adopt this pet!",
  "homeType": "House",
  "yardStatus": "Large fenced yard",
  "workSchedule": "One parent works from home",
  "currentPets": [
    { "type": "cat", "breed": "Siamese", "name": "Fluffy" }
  ],
  "petExperience": "10 years with dogs",
  "lifetimeCommitment": true
}
```

---

## ⚠️ Important Notes:

1. **Age Field**: Backend stores age in **months** and provides `ageDisplay` for display
2. **Image URLs**: Store image URLs (use Cloudinary or similar for uploads)
3. **Token Expiry**: Access token expires in 15 minutes, use refresh token
4. **CORS**: Backend allows `http://localhost:3000` - update if needed
5. **Port**: Backend runs on port 3001 (frontend likely on 3000 or 5173)

---

## 🧪 Quick Test:

**Test if backend is working:**
```bash
# Get all pets (no auth required)
curl http://localhost:3001/api/pets

# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"adopter123"}'
```

---

## 🚀 Start Both:

**Terminal 1 (Backend):**
```bash
cd pawbuddy_backend
npm run dev
# Running on http://localhost:3001
```

**Terminal 2 (Frontend):**
```bash
cd pawbuddy_frontend
npm run dev
# Running on http://localhost:3000 or 5173
```

---

## ✅ Integration Checklist:

- [ ] Backend running on port 3001
- [ ] Frontend API URL updated to `http://localhost:3001/api`
- [ ] Test login with sample credentials
- [ ] Test getting pets list
- [ ] Test creating booking
- [ ] Test adding to favourites
- [ ] Check token storage and refresh

---

**Your backend is ready! Connect your frontend and start testing!** 🎉

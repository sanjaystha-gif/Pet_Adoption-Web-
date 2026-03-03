# Backend Copilot Prompt (MongoDB Atlas) — Pet Adoption App

Build a production-ready backend API for a **Pet Adoption app** used by an existing React + TypeScript frontend.
The backend must keep the **same database field structure and enums** expected by the current frontend, so integration is smooth with minimal frontend change.

---

## 1) Required stack
- Node.js + TypeScript
- Express.js
- MongoDB Atlas (MongoDB)
- Mongoose
- JWT auth (access + refresh tokens)
- Validation with Zod/Joi
- Security: Helmet, CORS, Rate limiting
- Swagger/OpenAPI docs
- Postman collection + environment

Use clean architecture:
- `src/config`
- `src/models`
- `src/modules/auth`
- `src/modules/users`
- `src/modules/pets`
- `src/modules/bookings`
- `src/modules/favourites`
- `src/modules/admin`
- `src/middlewares`
- `src/routes`
- `src/utils`
- `src/app.ts`, `src/server.ts`

---

## 2) Global API response format (must be consistent)
Use this envelope for all APIs:

```json
{
  "success": true,
  "data": {},
  "message": "optional",
  "error": "optional"
}
```

For paginated list APIs:

```json
{
  "success": true,
  "data": {
    "items": [],
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

## 3) Frontend contract to preserve exactly (database/data shape compatibility)

### Pet
Required fields:
- `id: string` (map from Mongo `_id`)
- `name: string`
- `type: 'dog' | 'cat'`
- `breed: string`
- `age: number`  
  - **Important:** store in **months**
- `ageDisplay: string`  
  - computed by backend (examples: `8 months`, `1 year`, `1.5 years`, `2 years`)
- `gender: 'male' | 'female'`
- `size: 'small' | 'medium' | 'large'`
- `color: string`
- `weight: string`
- `vaccinated: boolean`
- `neutered: boolean`
- `status: 'available' | 'pending' | 'adopted'`
- `description: string`
- `personality: string[]`
- `images: string[]`
- `location: string`
- `postedDate: string` (ISO)
- `createdBy: string`

### Booking (Adoption Request)
Required fields:
- `id`
- `petId`, `petName`, `petImage`
- `adopterId`, `adopterName`, `adopterEmail`, `adopterPhone`
- `message`
- `homeType?: string`
- `yardStatus?: string`
- `workSchedule?: string`
- `currentPets?: Array<{ type: string; breed: string; name: string }>`
- `petExperience?: string`
- `lifetimeCommitment?: boolean`
- `status: 'pending' | 'approved' | 'rejected'`
- `submittedAt: string`
- `updatedAt: string`

### User
Required fields:
- `id`, `name`, `email`, `role`
- optional: `avatar`, `phone`, `bio`, `city`, `joinedDate`
- never expose password hash

---

## 4) Core modules and endpoints

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `PATCH /api/users/me`

Requirements:
- Hash passwords with bcrypt
- Access token short expiry
- Refresh token rotation
- Revoke refresh token on logout
- Store refresh tokens in DB (hashed)

### Pets
- `GET /api/pets`
  - query params: `q`, `type`, `breed`, `size`, `gender`, `status`, `color`, `location`, `ageRange`, `sort`, `page`, `pageSize`
  - `ageRange` mapping (months):
    - `baby`: `< 12`
    - `young`: `12-35`
    - `adult`: `36-83`
    - `senior`: `>= 84`
  - `sort` values: `newest | oldest | name-asc | name-desc`
- `GET /api/pets/:id`
- `POST /api/pets` (admin only)
- `PATCH /api/pets/:id` (admin only)
- `DELETE /api/pets/:id` (admin only)

### Bookings
- `POST /api/bookings` (adopter)
- `GET /api/bookings/me` (adopter)
- `DELETE /api/bookings/:id` (adopter, own pending only)
- `GET /api/admin/bookings` (admin, optional status filter)
- `PATCH /api/admin/bookings/:id/status` body `{ status: 'approved' | 'rejected' }`

Business rules:
- pet must exist before booking
- prevent duplicate active booking for same user + same pet
- optional behavior:
  - set pet status to `pending` on booking create
  - set pet status to `adopted` on booking approve

### Favourites
- `GET /api/favourites/me`
- `POST /api/favourites/:petId`
- `DELETE /api/favourites/:petId`

### Admin Users
- `GET /api/admin/users` (search + pagination)
- optional: `PATCH /api/admin/users/:id/role`

---

## 5) MongoDB schema/models required
Create Mongoose models:
- `User`
- `Pet`
- `Booking`
- `Favourite`
- `RefreshToken`

Indexes:
- User: unique email
- Pet: index `status`, `type`, `gender`, `breed`, `location`, `postedDate`
- Booking: index `adopterId`, `petId`, `status`, `submittedAt`
- Favourite: unique compound index on `(userId, petId)`
- RefreshToken: index on `userId`, expiry

Model behavior:
- use timestamps
- include virtual `id` and hide `_id`/`__v` in output where needed
- never expose password hash

---

## 6) Validation + error handling
- Validate body, params, query for all endpoints
- Return 400 for validation errors in consistent structure
- Return 401 for unauthenticated requests
- Return 403 for unauthorized/role violations
- Return 404 for missing resources
- Add centralized error middleware

---

## 7) Security requirements
- Helmet enabled
- CORS allow frontend origin from env
- Rate-limit auth routes (`/login`, `/register`)
- JWT secrets only from env
- Store only hashed refresh tokens

---

## 8) Environment variables (`.env.example`)
Include:
- `PORT`
- `NODE_ENV`
- `MONGODB_URI` (Atlas)
- `JWT_ACCESS_SECRET`
- `JWT_REFRESH_SECRET`
- `ACCESS_TOKEN_EXPIRES`
- `REFRESH_TOKEN_EXPIRES`
- `CORS_ORIGIN`

---

## 9) Postman deliverables (mandatory)
Create and include:
1. Postman Collection grouped by:
   - Auth
   - Pets
   - Bookings
   - Favourites
   - Admin
2. Postman Environment with:
   - `baseUrl`
   - `accessToken`
   - `refreshToken`
   - sample IDs (`petId`, `bookingId`)
3. Postman test scripts to auto-save token after login/refresh

---

## 10) Seed data
Add seed script with:
- 1 admin user
- 2 adopter users
- 10+ pets
- sample bookings
- sample favourites

Add npm scripts:
- `dev`
- `build`
- `start`
- `seed`

---

## 11) Documentation
README must include:
- setup steps
- Atlas DB connection setup
- env setup
- migration/seed/run commands
- API docs URL
- Postman import and usage steps

---

## 12) Acceptance criteria
- All endpoints above implemented and working
- Field names and enums match frontend exactly
- `age` is stored in months and `ageDisplay` returned by backend
- Admin can create/update/delete pets with full fields
- Adopter can register/login, submit complete adoption form, manage bookings/favourites
- Postman can test full flow end-to-end without code edits

---

## 13) Important implementation note
The existing frontend currently uses mock stores. Build backend APIs with these contracts so frontend can replace mocks later without shape mismatch.

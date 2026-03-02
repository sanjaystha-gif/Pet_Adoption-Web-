# 🐾 PawBuddy Backend

TypeScript Backend API for Pet Adoption Web Application

## 📁 Folder Structure

```
pawbuddy_backend/
├── src/
│   ├── config/          # Configuration files (database, environment)
│   ├── controllers/     # Request handlers and business logic
│   ├── middlewares/     # Custom middleware (auth, validation, error handling)
│   ├── models/          # Database models/schemas
│   ├── routes/          # API route definitions
│   ├── services/        # Business logic services
│   ├── types/           # TypeScript type definitions
│   ├── utils/           # Utility functions and helpers
│   ├── validators/      # Request validation schemas (Zod)
│   └── index.ts         # Application entry point
├── tests/
│   ├── unit/            # Unit tests
│   └── integration/     # Integration tests
├── uploads/             # Uploaded files storage
│   └── pets/            # Pet images
├── logs/                # Application logs
├── dist/                # Compiled JavaScript output
├── .env                 # Environment variables (not tracked)
├── .env.example         # Environment variables template
├── .gitignore           # Git ignore rules
├── package.json         # Project dependencies and scripts
├── tsconfig.json        # TypeScript configuration
└── README.md            # Project documentation
```

## 🚀 Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Configuration
```bash
# Copy the example environment file
cp .env.example .env

# Edit .env with your configuration
# Update DATABASE_URL, JWT_SECRET, etc.
```

### 3. Build the Project
```bash
npm run build
```

### 4. Run Development Server
```bash
npm run dev
```

### 5. Run Production Server
```bash
npm start
```

### 6. Watch Mode (Auto-compile on changes)
```bash
npm run watch
```

## 📚 Scripts

- `npm run build` - Compile TypeScript to JavaScript
- `npm run dev` - Run development server with ts-node
- `npm start` - Run production server (requires build first)
- `npm run watch` - Watch mode for TypeScript compilation
- `npm test` - Run tests

## 🛠️ Technologies

- **TypeScript** - Type-safe JavaScript
- **Node.js** - Runtime environment
- **Express** - Web framework
- **Zod** - Schema validation
- **Axios** - HTTP client
- **MongoDB** - Database (to be configured)

## 📋 API Endpoints (To be implemented)

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/logout` - User logout
- `GET /api/v1/auth/me` - Get current user

### Pets
- `GET /api/v1/pets` - Get all pets
- `GET /api/v1/pets/:id` - Get pet by ID
- `POST /api/v1/pets` - Create new pet (Auth required)
- `PUT /api/v1/pets/:id` - Update pet (Auth required)
- `DELETE /api/v1/pets/:id` - Delete pet (Auth required)

### Adoptions
- `POST /api/v1/adoptions` - Submit adoption request
- `GET /api/v1/adoptions` - Get adoption requests (Auth required)
- `PUT /api/v1/adoptions/:id` - Update adoption status (Auth required)

## 📝 Development Guidelines

1. **Type Safety**: Always define types for your data structures
2. **Validation**: Use Zod for request validation
3. **Error Handling**: Use the error middleware for consistent error responses
4. **Code Style**: Follow TypeScript best practices
5. **Documentation**: Document your API endpoints and complex logic

## 📄 License

ISC

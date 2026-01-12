# GigFlow - Freelance Marketplace Platform

A modern full-stack freelance marketplace where clients can post jobs and freelancers can submit bids. Built with React, Node.js, MongoDB, and Socket.io.

## Features

- 🔐 **Secure Authentication** - JWT-based auth with HttpOnly cookies
- 💼 **Gig Management** - Create, browse, and search for gigs
- 🎯 **Bidding System** - Submit proposals and manage bids
- ⚡ **Real-time Notifications** - Instant Socket.io notifications when hired
- 🔒 **Race Condition Prevention** - MongoDB transactions for atomic hiring
- 🎨 **Premium UI** - Glassmorphism design with smooth animations
- 📱 **Responsive Design** - Works seamlessly on all devices

## Tech Stack

### Frontend

- React 18 with TypeScript
- Vite for blazing-fast development
- Redux Toolkit for state management
- Tailwind CSS for styling
- Socket.io Client for real-time updates
- React Router for navigation

### Backend

- Node.js + Express
- MongoDB with Mongoose
- JWT authentication
- Socket.io for real-time features
- MongoDB transactions for data integrity

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:

```bash
cd gigFlow-backend
```

2. Install dependencies:

```bash
npm install
```

3. Create `.env` file:

```env
MONGODB_URI=mongodb://localhost:27017/gigflow
JWT_SECRET=your_secret_key_here
PORT=5000
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

4. Start the server:

```bash
npm run dev
```

Server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:

```bash
cd gigFlow-frontend
```

2. Install dependencies:

```bash
npm install
```

3. Create `.env` file:

```env
VITE_API_URL=http://localhost:5000
```

4. Start the development server:

```bash
npm run dev
```

Frontend will run on `http://localhost:5173`

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Gigs

- `GET /api/gigs` - Get all open gigs (supports `?search=query`)
- `GET /api/gigs/:id` - Get single gig
- `POST /api/gigs` - Create new gig (auth required)
- `PATCH /api/gigs/:id` - Update gig (owner only)
- `DELETE /api/gigs/:id` - Delete gig (owner only)

### Bids

- `POST /api/bids` - Submit a bid (auth required)
- `GET /api/bids/gig/:gigId` - Get all bids for a gig (owner only)
- `GET /api/bids/my-bids` - Get user's submitted bids
- `PATCH /api/bids/:bidId/hire` - Hire a freelancer (atomic operation)

## Key Features Explained

### Atomic Hiring Logic (Bonus 1)

The hire endpoint uses MongoDB transactions to ensure:

- Only one bid can be hired per gig
- All other bids are automatically rejected
- Gig status changes to "assigned"
- No race conditions even with simultaneous requests

```typescript
const session = await mongoose.startSession();
session.startTransaction();
// Atomic operations here
await session.commitTransaction();
```

### Real-time Notifications (Bonus 2)

Socket.io integration provides instant notifications:

- Freelancers receive immediate alerts when hired
- No page refresh required
- Connection managed per user session

## Project Structure

```
gigFlow/
├── gigFlow-backend/
│   ├── src/
│   │   ├── config/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── services/
│   │   └── server.ts
│   └── package.json
│
└── gigFlow-frontend/
    ├── src/
    │   ├── components/
    │   │   ├── auth/
    │   │   ├── gigs/
    │   │   ├── bids/
    │   │   ├── dashboard/
    │   │   └── common/
    │   ├── store/
    │   ├── hooks/
    │   ├── api/
    │   └── App.tsx
    └── package.json
```

## Deployment

### Backend (Railway/Render)

1. Create new project
2. Connect GitHub repository
3. Set environment variables
4. Deploy from `gigFlow-backend` directory

### Frontend (Vercel/Netlify)

1. Create new project
2. Connect GitHub repository
3. Set build command: `npm run build`
4. Set output directory: `dist`
5. Add environment variable: `VITE_API_URL`

## Usage Flow

1. **Sign Up/Login** - Create an account or login
2. **Browse Gigs** - View available projects
3. **Post a Gig** (Client) - Create a new project listing
4. **Submit Bid** (Freelancer) - Propose your price and pitch
5. **Review Bids** (Client) - See all proposals
6. **Hire** (Client) - Select the best freelancer
7. **Get Notified** (Freelancer) - Receive real-time hire notification

## Development

### Backend Development

```bash
cd gigFlow-backend
npm run dev
```

### Frontend Development

```bash
cd gigFlow-frontend
npm run dev
```

### Build for Production

```bash
# Backend
cd gigFlow-backend
npm run build
npm start

# Frontend
cd gigFlow-frontend
npm run build
npm run preview
```

## License

MIT

## Author

Built for Full Stack Development Internship Assignment

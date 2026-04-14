# Diabetes Tracker

Diabetes Tracker is a full-stack web app for tracking blood glucose readings in mmol/L. Users can register, log in, add readings, review their history, edit or delete readings, and see a simple dashboard with summary cards and a glucose chart.

## Features

- User registration and login with JWT authentication
- Protected frontend routes
- Add, view, edit, and delete glucose readings
- Dashboard summary with:
  - total readings
  - average glucose value
  - latest reading
  - glucose trend chart
- Navbar for logged-in users
- mmol/L-based glucose display across the app

## Tech Stack

### Frontend

- React
- TypeScript
- Vite
- Apollo Client
- React Router
- Recharts

### Backend

- Node.js
- Express
- Apollo Server
- GraphQL
- MongoDB Atlas
- Mongoose
- JWT

## Project Structure

```text
client/
  src/
    apollo/
    components/
    context/
    graphql/
    pages/
    styles/

server/
  src/
    config/
    models/
    schema/
    utils/
```

## Local Setup

### 1. Install dependencies

Frontend:

```bash
cd client
npm install
```

Backend:

```bash
cd server
npm install
```

### 2. Create environment files

Frontend:

Create `client/.env` from `client/.env.example`

```env
VITE_GRAPHQL_URL=http://localhost:5000/graphql
```

Backend:

Create `server/.env` from `server/.env.example`

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173
```

### 3. Run the backend

```bash
cd server
npm run dev
```

### 4. Run the frontend

```bash
cd client
npm run dev
```

## Required Environment Variables

### Frontend

- `VITE_GRAPHQL_URL`
  - GraphQL API URL used by Apollo Client
  - Local example: `http://localhost:5000/graphql`

### Backend

- `PORT`
  - Server port
- `MONGO_URI`
  - MongoDB Atlas connection string
- `JWT_SECRET`
  - Secret used to sign JWT tokens
- `CLIENT_URL`
  - Frontend URL allowed by CORS

## How Frontend and Backend Connect

The frontend uses Apollo Client and sends GraphQL requests to the URL stored in `VITE_GRAPHQL_URL`.

The backend exposes GraphQL at:

```text
/graphql
```

For local development:

- frontend runs on `http://localhost:5173`
- backend runs on `http://localhost:5000`

## mmol/L Notes

This project now uses mmol/L values for glucose readings.

- Normal range is shown like `4.0 to 7.0`
- Status logic:
  - Low: value < 4
  - Normal: value <= 7
  - High: value <= 10
  - Very High: value > 10

Old database readings may still exist from earlier testing, but the app now consistently displays values as mmol/L and does not apply old conversion logic on the frontend.

## Deployment Notes

### Frontend

Recommended host: **Vercel**

Set this environment variable in Vercel:

```env
VITE_GRAPHQL_URL=https://your-render-backend-url.onrender.com/graphql
```

### Backend

Recommended host: **Render**

Suggested Render settings:

- Build command:

```bash
npm install && npm run build
```

- Start command:

```bash
npm start
```

Set these environment variables in Render:

- `PORT`
- `MONGO_URI`
- `JWT_SECRET`
- `CLIENT_URL`

`CLIENT_URL` should be your deployed Vercel frontend URL.

## Completed Work

- Auth system is working
- Glucose CRUD is working
- Dashboard summary is working
- Dashboard chart is working
- Navbar is working
- External CSS styling is set up
- Frontend is prepared for deployment with env-based GraphQL configuration

## Notes

- Keep real secrets out of git
- Use `.env.example` files as templates
- If you already exposed a real MongoDB URI or JWT secret during development, rotate them before deployment

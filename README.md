# Stock Dashboard Backend

This is a Node.js Express backend for the Stock Dashboard app. It provides authentication and user data APIs, using MongoDB for persistent storage.

## Features
- User signup and login (JWT-based authentication)
- Portfolio and watchlist CRUD endpoints
- MongoDB for all data

## Setup
1. Copy `.env` and set your `MONGODB_URI` and `JWT_SECRET`.
2. Run `npm install` to install dependencies.
3. Start the server: `node index.js`

## API Endpoints
- `POST /api/auth/signup` — Register a new user
- `POST /api/auth/login` — Login and get JWT
- `GET/POST /api/user/portfolio` — Get/update portfolio (auth required)
- `GET/POST /api/user/watchlist` — Get/update watchlist (auth required)

## Deployment
Host this folder (backend) separately, e.g. on Render, and set the correct environment variables.

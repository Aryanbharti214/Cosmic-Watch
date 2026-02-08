# Cosmic Watch

**Description**: A Node.js backend system for tracking Near-Earth Objects (NEOs) using NASA's Open APIs, featuring real-time alerts, risk assessment, and user watchlists.

## 1. System Architecture

The application is built using a microservices-inspired monolithic architecture containerized with Docker.

* **Frontend**: React-based platform for displaying asteroid data and real-time interactions.
* **Backend**: Node.js with the Express framework.
* **Database**: MongoDB for persistent storage of users, chats, alerts, and watchlists.
* **Caching/Messaging**: Redis for NASA API response caching and managing real-time state.
* **Real-time Communication**: Socket.io for live chat rooms and instant asteroid alerts.

## 2. Tech Stack Details

### Node.js & Express

The server is built on **Node.js** using **Express 5.2.1**. It manages RESTful API routes, middleware for authentication, and centralized error handling.

### Redis

**Redis 7** is utilized as a high-performance caching layer to optimize data retrieval and stay within NASA API rate limits.

* **API Caching**: Responses from NASA are cached for 600 seconds (10 minutes).
* **Connection**: Managed via the `redis` client with configuration provided through the `REDIS_URL` environment variable.

### Database: MongoDB

**Cosmic Watch** uses **MongoDB 7** as its primary persistent data store, integrated using the **Mongoose ODM**.

* **Connection**: The application connects via a connection string defined in the `MONGO_URL` environment variable.
* **Containerization**: Orchestrated via `docker-compose.yml`, including a persistent volume named `mongo-data` mapped to `/data/db` to prevent data loss.
* **Security**: User passwords are encrypted using **bcrypt** with a salt factor of 10 before storage.

### Authentication: JSON Web Token (JWT)

Secure access to the API is managed through **JWT Authentication**.

* **Implementation**: Upon registration or login, the server generates a JWT using `jsonwebtoken` signed with a `JWT_SECRET` that expires in one day.
* **Middleware Protection**: The `protect` middleware verifies the `Authorization: Bearer <token>` header and attaches authenticated user data (excluding passwords) to `req.user`.

### Docker

The ecosystem is containerized for consistency and ease of deployment.

* **Backend Image**: Built using `node:20-alpine` for a lightweight footprint.
* **Orchestration**: `docker-compose.yml` manages the `backend`, `mongo`, and `redis` services.

### React

The **React** frontend serves as the primary user interface to visualize asteroid feeds, monitor risk levels, and participate in community chat rooms.

## 3. Core Services

* **NASA Service (`nasa.service.js`)**: Handles communication with NASA’s NEO API and implements Redis caching to optimize rate limits.
* **Risk Service (`risk.service.js`)**: Calculates a "Risk Score" based on hazardous status, diameter, miss distance, and relative velocity.
* **Risk Levels**: Low(<30), Moderate (>30), High (>60), and Extreme (>80).


* **Alert Service (`alert.service.js`)**: Runs a cron job every minute to check NASA's feed against user thresholds. If criteria are met, it triggers persistent notifications and real-time Socket.io emits.

## 4. API Endpoints

All RESTful routes are prefixed with `/api`.

### Authentication (`/api/auth`):

* `POST /register`: Public route for account creation.
* `POST /login`: Public route for obtaining a JWT token.
* `GET /me`: Protected route returning the authenticated user's profile.

### Asteroid Data (`/api/neo`):

* `GET /feed`: Returns a formatted list of today's asteroids with risk scores.

### Watchlist (`/api/watchlist`):

* `POST /:neoId`: Add a specific asteroid to the user’s watchlist.
* `GET /`: Retrieve all asteroids currently being watched by the user.

### Notifications (`/api/notifications`):

* `GET /`: Get user-specific asteroid alerts.
* `PUT /:id/read`: Mark a specific notification as read.

### System Health:

* `GET /api/health` or `GET /api/system/health`: Returns uptime and connection status for MongoDB and Redis.

## 5. Real-time Features (Socket.IO)

The server manages live interactions through two main channels:

* **Asteroid Chat**: Users join rooms based on `asteroidId`. The system fetches the last 20 messages as history and broadcasts new messages.
* **Global Alerts**: The `asteroid-alert` event is emitted globally when the Alert Scheduler detects a threat matching user criteria.

## 6. Database Models

* **User**: Stores profiles, hashed passwords, roles (user/researcher), and watched asteroid IDs.
* **Alert**: Contains user-specific configurations for proximity alerts and hazard filters.
* **Notification**: Records history of triggered alerts sent to specific users.
* **Watchlist**: Links users to specific NEOs with snapshots of their risk data.
* **Chat**: Persists real-time messages exchanged in asteroid discussion rooms.

## 7. Deployment & Environment

* **Orchestration**: `docker-compose up --build`.
* **Port**: 3000.
* **Critical Env Vars**: `MONGO_URL`, `REDIS_URL`, `JWT_SECRET`, `NASA_API_KEY`, `PORT`.
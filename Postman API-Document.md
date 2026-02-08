---

## Cosmic-Watch – API Documentation

Cosmic-Watch is an API for user authentication, retrieving Near-Earth Object (NEO) data, managing a user-specific watchlist, and viewing alert notifications.

Base URL (local development):

```text
http://localhost:3000
```

---

## Table of Contents

1. Overview  
2. Authentication & Authorization  
3. Endpoints  
   3.1. Auth  
   - Register – `POST /api/auth/register`  
   - Login – `POST /api/auth/login`  
   - Protected Route – `GET /api/auth/me`  

   3.2. NEO / System  
   - Neo-Feed – `GET /api/neo/feed`  
   - Health Check – `GET /api/system/health`  

   3.3. Watchlist & Alerts  
   - Add to Watchlist – `POST /api/watchlist/:neoId`  
   - Alerts / Notifications – `GET /api/notifications`  

4. Error Handling  
5. Environment & Variables  
6. Project Submission Notes  

---

## 1. Overview

Cosmic-Watch enables:

- **User Accounts** – registration and login  
- **Authentication** – token-based access to protected endpoints  
- **NEO Data** – fetches a feed of near-earth objects (e.g., from NASA-like data sources)  
- **Watchlist** – save specific NEOs for a user  
- **Alerts** – retrieve notifications related to tracked NEOs (e.g., high risk scores, close approaches)

The Postman collection name is **Cosmic-Watch**.

---

## 2. Authentication & Authorization

The API uses token-based authentication (typically a JWT) returned by the login endpoint.

- **Public endpoints** (no auth required):
  - `POST /api/auth/register`
  - `POST /api/auth/login`
  - `GET /api/system/health` (usually)

- **Protected endpoints** (require auth token):
  - `GET /api/auth/me`
  - `GET /api/neo/feed`
  - `POST /api/watchlist/:neoId`
  - `GET /api/notifications`

### 2.1. How to Authenticate

1. **Register** a new user via `POST /api/auth/register`.
2. **Login** via `POST /api/auth/login` to obtain a token.
3. Send the token with each protected request, typically in the `Authorization` header:

```http
Authorization: Bearer <token>
```

(If your implementation uses a different header or cookie-based auth, adjust this section accordingly.)

---

## 3. Endpoints

### 3.1. Auth

#### 3.1.1. Register

**Request**

- Method: `POST`  
- URL: `/api/auth/register`

**Headers**

```http
Content-Type: application/json
```

**Request Body (JSON)**  
Typical fields (adapt to your implementation):

```json
{
  "name": "Aryan",
  "email": "user@example.com",
  "password": "StrongPassword123"
}
```

**Responses**

- `201 Created` – User registered successfully  
  - Example (shape may vary):

    ```json
    {
      "id": "69877bbd75d7b0ad9f94fc9d",
      "name": "Aryan",
      "email": "user@example.com",
      "createdAt": "2026-02-07T18:40:00.000Z"
    }
    ```

- `400 Bad Request` – Validation error (e.g., email already in use, weak password)
- `500 Internal Server Error` – Server-side failure

---

#### 3.1.2. Login

**Request**

- Method: `POST`  
- URL: `/api/auth/login`

**Headers**

```http
Content-Type: application/json
```

**Request Body (JSON)**

```json
{
  "email": "user@example.com",
  "password": "StrongPassword123"
}
```

**Responses**

- `200 OK` – Login successful; returns token and optionally user info:

  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9....",
    "user": {
      "id": "69877bbd75d7b0ad9f94fc9d",
      "name": "Aryan",
      "email": "user@example.com"
    }
  }
  ```

- `401 Unauthorized` – Invalid credentials  
- `400 Bad Request` – Missing fields  
- `500 Internal Server Error` – Server failure

---

#### 3.1.3. Protected Route – Current User

**Request**

- Method: `GET`  
- URL: `/api/auth/me`

**Headers**

```http
Authorization: Bearer <token>
```

**Responses**

- `200 OK` – Returns authenticated user details:

  ```json
  {
    "id": "69877bbd75d7b0ad9f94fc9d",
    "name": "Aryan",
    "email": "user@example.com"
  }
  ```

- `401 Unauthorized` – Missing or invalid token  
- `500 Internal Server Error` – Server failure

---

### 3.2. NEO / System

#### 3.2.1. Neo-Feed

Fetches the Near-Earth Object (NEO) feed (for example, objects approaching Earth within a date range).

**Request**

- Method: `GET`  
- URL: `/api/neo/feed`  

You may optionally support query parameters such as:

```text
/api/neo/feed?start_date=2026-02-01&end_date=2026-02-08
```

**Headers**

```http
Authorization: Bearer <token>
```

**Responses**

- `200 OK` – NEO feed data:

  ```json
  {
    "count": 42,
    "objects": [
      {
        "neoId": "3449121",
        "name": "(2009 EW)",
        "riskScore": 8.8,
        "closeApproachDate": "1974-09-09T00:00:00.000Z",
        "magnitude": 22.3,
        "isPotentiallyHazardous": true
      }
      // ...
    ]
  }
  ```

- `401 Unauthorized` – Missing or invalid token  
- `500 Internal Server Error` – Error fetching NEO data

---

#### 3.2.2. Health Check

Checks if the API/system is up.

**Request**

- Method: `GET`  
- URL: `/api/system/health`

**Headers**

No special headers required (usually public).

**Response**

- `200 OK` – Service is healthy:

  ```json
  {
    "status": "ok",
    "uptime": 12345,
    "timestamp": "2026-02-07T18:50:00.000Z"
  }
  ```

- `500 Internal Server Error` – Something is wrong with the service

---

### 3.3. Watchlist & Alerts

#### 3.3.1. Add to Watchlist

Adds a specific NEO to the authenticated user’s watchlist.

This is the request you currently have open in Postman:

- Collection: Cosmic-Watch  
- Request name: `watchlist`  
- Method: `POST`  
- URL: `http://localhost:3000/api/watchlist/3449121`  
- Active response example:

```json
{
  "userId": "69877bbd75d7b0ad9f94fc9d",
  "neoId": "3449121",
  "name": "(2009 EW)",
  "riskScore": 8.8,
  "closeApproachDate": "1974-09-09T00:00:00.000Z",
  "_id": "69878944b0519d26caefec11",
  "createdAt": "2026-02-07T18:49:40.441Z",
  "updatedAt": "2026-02-07T18:49:40.441Z",
  "__v": 0
}
```

**Request**

- Method: `POST`  
- URL: `/api/watchlist/:neoId`

Example:

```text
/api/watchlist/3449121
```

**Headers**

```http
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body**

Currently your Postman request has **no body**, which suggests that all required information (such as `neoId`) is taken from the URL, and the server fills the rest from its data source.  
If your final implementation needs extra data, add it here (for example):

```json
{
  "name": "(2009 EW)",
  "riskScore": 8.8,
  "closeApproachDate": "1974-09-09T00:00:00.000Z"
}
```

**Responses**

- `201 Created` – Watchlist entry created (see example above)  
- `400 Bad Request` – Invalid NEO ID or already in watchlist  
- `401 Unauthorized` – Missing or invalid token  
- `404 Not Found` – NEO not found  
- `500 Internal Server Error` – Database or server error

---

#### 3.3.2. Alerts / Notifications

Retrieves alert notifications for the authenticated user (e.g., newly risky NEOs in watchlist, close approaches, etc.).

**Request**

- Method: `GET`  
- URL: `/api/notifications`

**Headers**

```http
Authorization: Bearer <token>
```

**Responses**

- `200 OK` – List of notifications:

  ```json
  {
    "count": 2,
    "notifications": [
      {
        "id": "notif_1",
        "type": "RISK_ALERT",
        "neoId": "3449121",
        "name": "(2009 EW)",
        "riskScore": 8.8,
        "message": "NEO (2009 EW) has a high risk score.",
        "createdAt": "2026-02-07T18:55:00.000Z",
        "read": false
      },
      {
        "id": "notif_2",
        "type": "CLOSE_APPROACH",
        "neoId": "1234567",
        "name": "Some Other NEO",
        "message": "Close approach detected for Some Other NEO.",
        "createdAt": "2026-02-08T09:10:00.000Z",
        "read": true
      }
    ]
  }
  ```

- `401 Unauthorized` – Missing or invalid token  
- `500 Internal Server Error` – Server failure

---

## 4. Error Handling

Common error response format (you can adapt based on your implementation):

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Email is already in use"
  }
}
```

Typical status codes:

- `400 Bad Request` – Invalid request payload/parameters  
- `401 Unauthorized` – Missing/invalid token  
- `403 Forbidden` – Authenticated, but not allowed  
- `404 Not Found` – Resource doesn’t exist  
- `500 Internal Server Error` – Unexpected server error

---

## 5. Environment & Variables (Postman)

In Postman, you can configure an environment (e.g., `Local`) with variables:

```text
{{baseUrl}} = http://localhost:3000
{{token}}   = <JWT token from login>
```

Then update your collection to use:

- URL: `{{baseUrl}}/api/auth/login`  
- Header: `Authorization: Bearer {{token}}`

This makes it easier to switch between dev/staging/production environments.

---

## 6. Project Submission Notes

You can include the following in your project submission:

1. **Architecture Summary**

   - Node.js/Express backend (assumed; adapt to your stack).  
   - Authentication using JWT and `Authorization: Bearer <token>` header.  
   - Database (e.g., MongoDB) storing:
     - Users  
     - Watchlist entries (linking `userId` and `neoId`)  
     - Notifications/alerts

2. **Data Model Example (from your actual response)**

   - Watchlist item example:

     ```json
     {
       "userId": "69877bbd75d7b0ad9f94fc9d",
       "neoId": "3449121",
       "name": "(2009 EW)",
       "riskScore": 8.8,
       "closeApproachDate": "1974-09-09T00:00:00.000Z",
       "_id": "69878944b0519d26caefec11",
       "createdAt": "2026-02-07T18:49:40.441Z",
       "updatedAt": "2026-02-07T18:49:40.441Z",
       "__v": 0
     }
     ```

3. **How to Run Locally**

   ```bash
   # 1. Install dependencies
   npm install

   # 2. Set environment variables (example)
   export PORT=3000
   export MONGODB_URI=mongodb://localhost:27017/cosmic-watch
   export JWT_SECRET=your_jwt_secret_here
   # plus any NASA or external API keys if used

   # 3. Start server
   npm start
   ```

4. **Postman Collection**

   - Collection name: `Cosmic-Watch`  
   - Requests:
     - Register  
     - Login  
     - Protected Route (`/api/auth/me`)  
     - Neo-Feed  
     - Health Check  
     - Watchlist (`POST /api/watchlist/:neoId`)  
     - ALERT PERSISTENCE (`/api/notifications`)

   Mention that the collection can be imported into Postman to easily test all endpoints.




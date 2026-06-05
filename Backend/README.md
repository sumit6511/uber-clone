# Uber Clone Backend API Documentation

This documentation covers the current Uber Clone backend API and the registration endpoint.

## Backend overview

The backend is built with:

- Node.js + Express
- MongoDB / Mongoose
- bcrypt for password hashing
- JSON Web Tokens (`jsonwebtoken`) for auth token generation
- express-validator for request validation

### Key files

- `server.js` — starts the HTTP server and connects to MongoDB
- `app.js` — configures middleware and routes
- `db/db.js` — MongoDB connection helper
- `models/user.model.js` — user schema and auth helper methods
- `services/user.service.js` — user creation logic
- `controllers/user.controller.js` — request handling for registration
- `routes/user.routes.js` — `/register` route definition

## Prerequisites

Required environment variables:

- `MONGO_URI` — MongoDB connection string
- `JWT_SECRET` — secret used to sign auth tokens
- `PORT` — optional server port (defaults to `3000`)

## Installation & run

```bash
cd Backend
npm install
npm run dev
```

Or start normally:

```bash
npm start
```

## Base URL

All API requests are prefixed with `/api`.

## Users

### Register a user

Creates a new user account.

**Endpoint:**
`POST /api/users/register`

**Request Body:**

| Field                | Type   | Required | Description                                 |
| -------------------- | ------ | -------- | ------------------------------------------- |
| `fullName.firstName` | string | Yes      | First name, minimum 3 characters            |
| `fullName.lastName`  | string | No       | Last name, minimum 3 characters if provided |
| `email`              | string | Yes      | Valid email address                         |
| `password`           | string | Yes      | Password, minimum 6 characters              |

**Example Request:**

```json
{
  "fullName": {
    "firstName": "John",
    "lastName": "Doe"
  },
  "email": "john.doe@example.com",
  "password": "securepassword123"
}
```

**Success Response (201 Created):**

```json
{
  "msg": "User registered successfully",
  "user": {
    "_id": "60d0fe4f5311236168a109ca",
    "fullName": {
      "firstName": "John",
      "lastName": "Doe"
    },
    "email": "john.doe@example.com",
    "socketId": null,
    "__v": 0
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

> Note: the exact `user` object may vary based on Mongoose document formatting.

**Validation Error Response (400 Bad Request):**

```json
{
  "errors": [
    {
      "value": "Jo",
      "msg": "First name must be at least 3 characters long",
      "param": "fullName.firstName",
      "location": "body"
    }
  ]
}
```

**Failure Response (400 Bad Request):**

```json
{
  "error": "Email is already registered"
}
```

### Login a user

Authenticates an existing user and returns a JWT token.

**Endpoint:**
`POST /api/users/login`

**Request Body:**

| Field      | Type   | Required | Description                   |
| ---------- | ------ | -------- | ----------------------------- |
| `email`    | string | Yes      | Registered user email address |
| `password` | string | Yes      | User password                 |

**Example Request:**

```json
{
  "email": "john.doe@example.com",
  "password": "securepassword123"
}
```

**Success Response (200 OK):**

```json
{
  "msg": "Login successful",
  "user": {
    "_id": "60d0fe4f5311236168a109ca",
    "fullName": {
      "firstName": "John",
      "lastName": "Doe"
    },
    "email": "john.doe@example.com",
    "socketId": null,
    "__v": 0
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Failure Response (400 Bad Request):**

```json
{
  "error": "Invalid credentials"
}
```

### Get user profile

Returns the currently authenticated user profile.

**Endpoint:**
`GET /api/users/profile`

**Headers:**

| Header          | Value            | Required | Description                   |
| --------------- | ---------------- | -------- | ----------------------------- |
| `Authorization` | `Bearer <token>` | Yes      | JWT token returned from login |

**Success Response (200 OK):**

```json
{
  "user": {
    "_id": "60d0fe4f5311236168a109ca",
    "fullName": {
      "firstName": "John",
      "lastName": "Doe"
    },
    "email": "john.doe@example.com",
    "socketId": null,
    "__v": 0
  }
}
```

**Failure Response (401 Unauthorized):**

```json
{
  "error": "Access denied! No token provided."
}
```

```json
{
  "error": "Unauthorized! Invalid token."
}
```

### Logout a user

Clears the auth token cookie and logs out the current user.

**Endpoint:**
`POST /api/users/logout`

**Headers:**

| Header          | Value            | Required | Description                   |
| --------------- | ---------------- | -------- | ----------------------------- |
| `Authorization` | `Bearer <token>` | Yes      | JWT token returned from login |

**Success Response (200 OK):**

```json
{
  "msg": "Logout successful"
}
```

**Failure Response (401 Unauthorized):**

```json
{
  "error": "Access denied! No token provided."
}
```

```json
{
  "error": "Unauthorized! Invalid token."
}
```

## Notes

- Passwords are hashed using `bcrypt` before saving.
- Tokens are signed with `JWT_SECRET`.
- The app listens on `PORT` or `3000` by default.

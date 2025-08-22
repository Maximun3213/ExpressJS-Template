# Authentication System Documentation

## Overview

This authentication system implements JWT-based authentication with both access tokens and refresh tokens for secure user authentication and session management.

## Features

- **Access Token**: Short-lived token (default: 15 minutes) for API access
- **Refresh Token**: Long-lived token (default: 7 days) for obtaining new access tokens
- **Secure Logout**: Invalidates refresh tokens on logout
- **Token Rotation**: Generates new refresh tokens on each refresh request
- **Role-based Access Control**: Support for different user roles

## Environment Variables

Add these to your `.env` file:

```env
# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here
JWT_ACCESS_SECRET=your_access_token_secret_key_here
JWT_REFRESH_SECRET=your_refresh_token_secret_key_here
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
```

## API Endpoints

### 1. Login

**POST** `/api/users/login`

Login with email and password to receive access and refresh tokens.

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "yourpassword"
}
```

**Response (200 OK):**

```json
{
  "message": "Login successful",
  "status": 200,
  "data": {
    "user": {
      "id": "user_id",
      "name": "User Name",
      "email": "user@example.com",
      "role": "user",
      "isEmailVerified": false,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "tokenType": "Bearer",
    "expiresIn": "15m"
  }
}
```

### 2. Refresh Token

**POST** `/api/users/refresh-token`

Get new access and refresh tokens using a valid refresh token.

**Request Body:**

```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200 OK):**

```json
{
  "message": "Tokens refreshed successfully",
  "status": 200,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "tokenType": "Bearer",
    "expiresIn": "15m"
  }
}
```

### 3. Logout

**POST** `/api/users/logout`

Invalidate refresh token and logout user.

**Request Body (Option 1 - Using Refresh Token):**

```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Request Body (Option 2 - Using Access Token in Header):**

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200 OK):**

```json
{
  "message": "Logout successful",
  "status": 200
}
```

### 4. Get User Profile

**GET** `/api/users/me`

Get current user information (requires authentication).

**Request Headers:**

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200 OK):**

```json
{
  "message": "Get information successfully",
  "status": 200,
  "data": {
    "id": "user_id",
    "name": "User Name",
    "email": "user@example.com",
    "role": "user",
    "isEmailVerified": false,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

## Client-Side Implementation

### JavaScript/TypeScript Example

```typescript
class AuthService {
  private accessToken: string | null = null
  private refreshToken: string | null = null

  async login(email: string, password: string) {
    const response = await fetch('/api/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    })

    if (response.ok) {
      const data = await response.json()
      this.accessToken = data.data.accessToken
      this.refreshToken = data.data.refreshToken

      // Store tokens in localStorage or secure storage
      localStorage.setItem('accessToken', this.accessToken)
      localStorage.setItem('refreshToken', this.refreshToken)

      return data
    }

    throw new Error('Login failed')
  }

  async refreshAccessToken() {
    if (!this.refreshToken) {
      throw new Error('No refresh token available')
    }

    const response = await fetch('/api/users/refresh-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ refreshToken: this.refreshToken })
    })

    if (response.ok) {
      const data = await response.json()
      this.accessToken = data.data.accessToken
      this.refreshToken = data.data.refreshToken

      // Update stored tokens
      localStorage.setItem('accessToken', this.accessToken)
      localStorage.setItem('refreshToken', this.refreshToken)

      return data
    }

    throw new Error('Token refresh failed')
  }

  async apiCall(url: string, options: RequestInit = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    }

    if (this.accessToken) {
      headers.Authorization = `Bearer ${this.accessToken}`
    }

    let response = await fetch(url, {
      ...options,
      headers
    })

    // If token expired, try to refresh
    if (response.status === 401 && this.refreshToken) {
      try {
        await this.refreshAccessToken()

        // Retry the original request with new token
        headers.Authorization = `Bearer ${this.accessToken}`
        response = await fetch(url, {
          ...options,
          headers
        })
      } catch (error) {
        // Refresh failed, redirect to login
        this.logout()
        throw new Error('Authentication failed')
      }
    }

    return response
  }

  async logout() {
    if (this.refreshToken) {
      try {
        await fetch('/api/users/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ refreshToken: this.refreshToken })
        })
      } catch (error) {
        console.error('Logout request failed:', error)
      }
    }

    // Clear tokens
    this.accessToken = null
    this.refreshToken = null
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
  }
}
```

## Security Best Practices

1. **Store tokens securely**: Use secure, httpOnly cookies or encrypted local storage
2. **Implement automatic token refresh**: Refresh tokens before they expire
3. **Use HTTPS**: Always use HTTPS in production
4. **Rotate refresh tokens**: The system automatically rotates refresh tokens on each refresh
5. **Validate tokens server-side**: Always validate tokens on the server for protected routes
6. **Handle token expiration gracefully**: Implement proper error handling for expired tokens

## Error Responses

### 400 Bad Request

```json
{
  "message": "Email and password are required",
  "status": 400
}
```

### 401 Unauthorized

```json
{
  "message": "Invalid or expired access token",
  "status": 401
}
```

### 403 Forbidden

```json
{
  "message": "Insufficient permissions",
  "status": 403
}
```

## Token Payload

Both access and refresh tokens contain:

```json
{
  "id": "user_id",
  "email": "user@example.com",
  "role": "user",
  "iat": 1234567890,
  "exp": 1234567890
}
```

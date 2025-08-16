# Node Auth API

## Getting Started

```bash
npm i
```

Rename `.env.sample` to `.env` and configure your environment variables.

Start server:

```bash
npm start
# or
npm run start
# or for dev mode
npm run dev
```

---

## API Routes

### 0. **Root Route**
- **GET** `/`
- **No auth required**
- **Response:**
  ```json
  {
    "success": true,
    "statusCode": 200,
    "message": "Welcome to the API",
    "data": null
  }
  ```

---

### 1. **Sign Up**
- **POST** `/api/v1/auth/signup`
- **Body (JSON):**
  ```json
  {
    "username": "nitish",
    "email": "nitish@gmail.com",
    "password": "nitish@123"
  }
  ```
- **Response:** User object, success message

---

### 2. **Sign In**
- **POST** `/api/v1/auth/signin`
- **Body (JSON):**
  - Using username:
    ```json
    {
      "username": "nitish",
      "password": "nitish@123"
    }
    ```
  - Using email:
    ```json
    {
      "email": "nitish@gmail.com",
      "password": "nitish@123"
    }
    ```
- **Response:** User info, tokens set in cookies

---

### 3. **Logout**
- **POST** `/api/v1/auth/logout`
- **No body required**
- **Response:** Success message, cookies cleared

---

### 4. **Public Route**
- **GET** `/api/v1/auth/public`
- **No auth required**
- **Response:** Success message

---

### 5. **Protected Route**
- **GET** `/api/v1/auth/protected`
- **Requires:** Valid access token (cookie or Bearer header)
- **Response:** Authenticated user info

---

### 6. **Refresh Access Token**
- **POST** `/api/v1/auth/refresh`
- **Requires:** Valid refresh token (cookie)
- **Response:** New access token

---

### 7. **Fallback Route**
- Any undefined route returns:
  ```json
  {
    "success": false,
    "statusCode": 404,
    "message": "Route not found"
  }
  ```

---

## Notes

- All requests and responses use JSON.
- Auth tokens are sent as HTTP-only cookies.
- Use Postman or similar tools to test the API endpoints.

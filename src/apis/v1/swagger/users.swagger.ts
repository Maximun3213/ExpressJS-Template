/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: User ID
 *         name:
 *           type: string
 *           description: User's full name
 *         email:
 *           type: string
 *           format: email
 *           description: User's email address
 *         avatar:
 *           type: string
 *           nullable: true
 *           description: User's avatar URL
 *         role:
 *           type: string
 *           default: "user"
 *           description: User's role
 *         isEmailVerified:
 *           type: boolean
 *           default: false
 *           description: Whether user's email is verified
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     LoginRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: User's email address
 *         password:
 *           type: string
 *           minLength: 8
 *           description: User's password
 *     LoginResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Login successful"
 *         status:
 *           type: number
 *           example: 200
 *         data:
 *           type: object
 *           properties:
 *             user:
 *               $ref: '#/components/schemas/User'
 *     RegisterRequest:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *         - confirmPassword
 *       properties:
 *         name:
 *           type: string
 *           description: User's full name
 *         email:
 *           type: string
 *           format: email
 *           description: User's email address
 *         password:
 *           type: string
 *           minLength: 8
 *           description: User's password
 *         confirmPassword:
 *           type: string
 *           minLength: 8
 *           description: Password confirmation
 *     RegisterResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Sign up successful!"
 *         status:
 *           type: number
 *           example: 201
 *     RefreshTokenRequest:
 *       type: object
 *       required:
 *         - refreshToken
 *       properties:
 *         refreshToken:
 *           type: string
 *           description: Refresh token for authentication
 *     RefreshTokenResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Tokens refreshed successfully"
 *         status:
 *           type: number
 *           example: 200
 *         data:
 *           type: object
 *           properties:
 *             userData:
 *               $ref: '#/components/schemas/User'
 *     LogoutRequest:
 *       type: object
 *       properties:
 *         refreshToken:
 *           type: string
 *           description: Refresh token to invalidate
 *     LogoutResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Logout successful"
 *         status:
 *           type: number
 *           example: 200
 *     GetMeResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Get information successfully"
 *         status:
 *           type: number
 *           example: 200
 *         data:
 *           $ref: '#/components/schemas/User'
 *     FindUsersByNameResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Get users successfully"
 *         status:
 *           type: number
 *           example: 200
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/User'
 *         count:
 *           type: number
 *           description: Number of users returned
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Error message
 *         status:
 *           type: number
 *           description: HTTP status code
 *         error:
 *           type: string
 *           description: Additional error details (optional)
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User authentication and management
 */

/**
 * @swagger
 * /api/users/me:
 *   get:
 *     summary: Get current user information
 *     description: Retrieve information about the currently authenticated user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User information retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GetMeResponse'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: User login
 *     description: Authenticate user with email and password
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *         headers:
 *           Set-Cookie:
 *             description: Authentication cookies set
 *             schema:
 *               type: string
 *       400:
 *         description: Bad request - Missing email/password or invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: User registration
 *     description: Create a new user account
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RegisterResponse'
 *       400:
 *         description: Bad request - Invalid data or email already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/users/refresh-token:
 *   post:
 *     summary: Refresh access token
 *     description: Get new access token using refresh token
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RefreshTokenRequest'
 *     responses:
 *       200:
 *         description: Tokens refreshed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RefreshTokenResponse'
 *         headers:
 *           Set-Cookie:
 *             description: New authentication cookies set
 *             schema:
 *               type: string
 *       400:
 *         description: Bad request - Missing refresh token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized - Invalid or expired refresh token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/users/logout:
 *   post:
 *     summary: User logout
 *     description: Logout user and invalidate tokens
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LogoutRequest'
 *     responses:
 *       200:
 *         description: Logout successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LogoutResponse'
 *         headers:
 *           Set-Cookie:
 *             description: Authentication cookies cleared
 *             schema:
 *               type: string
 *       400:
 *         description: Bad request - Missing tokens
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized - Invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/users/search:
 *   get:
 *     summary: Search users by name
 *     description: Find users by name with pagination (limit 10)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Name to search for (case-insensitive)
 *       - in: body
 *         name: userId
 *         schema:
 *           type: string
 *         description: Current user ID to exclude from results
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FindUsersByNameResponse'
 *       401:
 *         description: Unauthorized - Invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

import UsersController from '@/controllers/users.controllers'
import { authenticateToken } from '@/middlewares/users.middlewares'
import express from 'express'

// import { needToBeSuperAdminRole, needToLogin } from '@/middlewares/index'

const userRouter = express.Router()

// Public routes (no authentication required)
userRouter.post('/login', UsersController.login)
userRouter.post('/register', UsersController.register)
userRouter.post('/refresh-token', UsersController.refreshToken)
userRouter.post('/logout', UsersController.logout)

// Protected routes (authentication required)
userRouter.get('/me', authenticateToken, UsersController.getMe)

userRouter.get('/find-users', authenticateToken, UsersController.findUsersByName)
// userRouter.get('/verify/:token', userController.verify)
// userRouter.get('/role/Admin', userController.getAllCreatorsByUsername)
// userRouter.get('/:id', userController.getById)

// userRouter.post('/', userController.create)
// userRouter.post('/forgot-password', userController.forgotPassword)
// userRouter.post('/reset-password/:token', userController.resetPassword)
// userRouter.post('/resend-forgot-password-email/:email', userController.resendForgotPassword) // CHANGE
// userRouter.post('/resend-verification-email/:email', userController.resendVerificationEmail) // CHANGE

// ALL ROUTES BELOW NEED TO LOGIN
// userRouter.use(authenticateToken)

// userRouter.put('/me', userController.update)
// userRouter.put('/change-password', userController.changePassword)

// ALL ROUTES BELOW NEED TO BE SUPER ADMIN
// userRouter.use(requireRole(['admin', 'superadmin']))

// userRouter.put('/:id/update-permission', userController.updatePermission)
// userRouter.put('/:id/update-status/:status', userController.updateStatus)
// userRouter.put('/:id/update-status/:status', userController.updateStatus)
// userRouter.put('/update-status/:status', userController.updateMultipleStatus)
// userRouter.put('/:id/update-role/:role', userController.updateRole)
// userRouter.put('/update-role/:role', userController.updateMultipleRole)

export default userRouter

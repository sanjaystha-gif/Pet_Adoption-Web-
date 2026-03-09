import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.js';
import { updateProfile, getCurrentUser } from './users.controller.js';

const router = Router();

/**
 * @swagger
 * /api/users/me:
 *   get:
 *     summary: Get current user's profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     role:
 *                       type: string
 *                       enum: [admin, adopter]
 *                     avatar:
 *                       type: string
 *                       nullable: true
 *                     phone:
 *                       type: string
 *                       nullable: true
 *                     city:
 *                       type: string
 *                       nullable: true
 *                     bio:
 *                       type: string
 *                       nullable: true
 *                     joinedDate:
 *                       type: string
 *                       format: date-time
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
router.get('/me', authenticate, getCurrentUser);

/**
 * @swagger
 * /api/users/me:
 *   patch:
 *     summary: Update current user's profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 80
 *               phone:
 *                 type: string
 *                 maxLength: 30
 *                 nullable: true
 *               city:
 *                 type: string
 *                 maxLength: 80
 *                 nullable: true
 *               bio:
 *                 type: string
 *                 maxLength: 500
 *                 nullable: true
 *               avatar:
 *                 type: string
 *                 format: uri
 *                 maxLength: 500
 *                 nullable: true
 *                 description: Cloudinary URL for user avatar
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     role:
 *                       type: string
 *                       enum: [admin, adopter]
 *                     avatar:
 *                       type: string
 *                       nullable: true
 *                     phone:
 *                       type: string
 *                       nullable: true
 *                     city:
 *                       type: string
 *                       nullable: true
 *                     bio:
 *                       type: string
 *                       nullable: true
 *                     joinedDate:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
router.patch('/me', authenticate, updateProfile);

export default router;

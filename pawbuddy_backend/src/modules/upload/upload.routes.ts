import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.js';
import { uploadSingle, uploadMultiple } from '../../middlewares/upload.js';
import {
  uploadImage,
  uploadImages,
  deleteImage,
} from './upload.controller.js';

const router = Router();

// All upload routes require authentication
router.use(authenticate);

/**
 * @swagger
 * /api/upload/single:
 *   post:
 *     summary: Upload single image
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Image uploaded successfully
 */
router.post('/single', uploadSingle, uploadImage);

/**
 * @swagger
 * /api/upload/multiple:
 *   post:
 *     summary: Upload multiple images (max 5)
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Images uploaded successfully
 */
router.post('/multiple', uploadMultiple, uploadImages);

/**
 * @swagger
 * /api/upload/delete:
 *   delete:
 *     summary: Delete image from Cloudinary
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               publicId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Image deleted successfully
 */
router.delete('/delete', deleteImage);

export default router;

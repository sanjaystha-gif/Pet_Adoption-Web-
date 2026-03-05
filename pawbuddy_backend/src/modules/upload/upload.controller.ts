import { Response } from 'express';
import { AuthRequest } from '../../middlewares/auth.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../../config/cloudinary.js';
import { sendSuccess, sendError } from '../../utils/response.js';

/**
 * Upload single image
 */
export const uploadImage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      sendError(res, 'No image file provided', undefined, 400);
      return;
    }

    const folder = (req.query.folder as string) || 'pawbuddy';
    
    // Upload to Cloudinary
    const result = await uploadToCloudinary(req.file.buffer, folder);

    sendSuccess(
      res,
      {
        imageUrl: result.secure_url,
        publicId: result.public_id,
      },
      'Image uploaded successfully',
      201
    );
  } catch (error) {
    console.error('Upload image error:', error);
    sendError(res, 'Failed to upload image', undefined, 500);
  }
};

/**
 * Upload multiple images
 */
export const uploadImages = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const files = req.files as Express.Multer.File[];
    
    if (!files || files.length === 0) {
      sendError(res, 'No image files provided', undefined, 400);
      return;
    }

    const folder = (req.query.folder as string) || 'pawbuddy';

    // Upload all images to Cloudinary
    const uploadPromises = files.map((file) =>
      uploadToCloudinary(file.buffer, folder)
    );

    const results = await Promise.all(uploadPromises);

    const uploadedImages = results.map((result) => ({
      imageUrl: result.secure_url,
      publicId: result.public_id,
    }));

    sendSuccess(res, uploadedImages, 'Images uploaded successfully', 201);
  } catch (error) {
    console.error('Upload images error:', error);
    sendError(res, 'Failed to upload images', undefined, 500);
  }
};

/**
 * Delete image from Cloudinary
 */
export const deleteImage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { publicId } = req.body;

    if (!publicId) {
      sendError(res, 'Public ID is required', undefined, 400);
      return;
    }

    await deleteFromCloudinary(publicId);

    sendSuccess(res, null, 'Image deleted successfully', 200);
  } catch (error) {
    console.error('Delete image error:', error);
    sendError(res, 'Failed to delete image', undefined, 500);
  }
};

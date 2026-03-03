import { Response } from 'express';
import { z } from 'zod';
import { AuthRequest } from '../../middlewares/auth.js';
import { Pet } from '../../models/index.js';
import { sendSuccess, sendError, sendPaginated } from '../../utils/response.js';
import {
  CreatePetRequest,
  UpdatePetRequest,
  PetFilterRequest,
  createPetSchema,
  updatePetSchema,
  petFilterSchema,
} from './pets.validator.js';

/**
 * Get all pets with filtering, pagination, and sorting
 */
export const getPets = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // Validate and parse query parameters
    const query = petFilterSchema.parse(req.query);

    // Build filter object
    const filter: any = {};

    // Search by name or description
    if (query.q) {
      filter.$or = [
        { name: { $regex: query.q, $options: 'i' } },
        { description: { $regex: query.q, $options: 'i' } },
      ];
    }

    // Filter by type
    if (query.type) {
      filter.type = query.type;
    }

    // Filter by breed
    if (query.breed) {
      filter.breed = { $regex: query.breed, $options: 'i' };
    }

    // Filter by gender
    if (query.gender) {
      filter.gender = query.gender;
    }

    // Filter by size
    if (query.size) {
      filter.size = query.size;
    }

    // Filter by status
    if (query.status) {
      filter.status = query.status;
    }

    // Filter by color
    if (query.color) {
      filter.color = { $regex: query.color, $options: 'i' };
    }

    // Filter by location
    if (query.location) {
      filter.location = { $regex: query.location, $options: 'i' };
    }

    // Filter by age range (in months)
    if (query.ageRange) {
      switch (query.ageRange) {
        case 'baby':
          filter.age = { $lt: 12 };
          break;
        case 'young':
          filter.age = { $gte: 12, $lt: 36 };
          break;
        case 'adult':
          filter.age = { $gte: 36, $lt: 84 };
          break;
        case 'senior':
          filter.age = { $gte: 84 };
          break;
      }
    }

    // Determine sort
    let sortObj: any = { postedDate: -1 }; // default: newest first
    if (query.sort) {
      switch (query.sort) {
        case 'oldest':
          sortObj = { postedDate: 1 };
          break;
        case 'name-asc':
          sortObj = { name: 1 };
          break;
        case 'name-desc':
          sortObj = { name: -1 };
          break;
        case 'newest':
        default:
          sortObj = { postedDate: -1 };
          break;
      }
    }

    // Calculate pagination
    const skip = (query.page - 1) * query.pageSize;

    // Query database
    const [items, total] = await Promise.all([
      Pet.find(filter)
        .sort(sortObj)
        .skip(skip)
        .limit(query.pageSize)
        .lean(),
      Pet.countDocuments(filter),
    ]);

    // Transform items to include ageDisplay
    const transformedItems = items.map((item: any) => ({
      ...item,
      id: item._id.toString(),
      ageDisplay: computeAgeDisplay(item.age),
      _id: undefined,
      __v: undefined,
    }));

    sendPaginated(
      res,
      transformedItems,
      {
        page: query.page,
        pageSize: query.pageSize,
        total,
      },
      'Pets retrieved successfully',
      200
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      sendError(res, 'Validation error', JSON.stringify(error.issues), 400);
      return;
    }
    console.error('Get pets error:', error);
    sendError(res, 'Internal server error', undefined, 500);
  }
};

/**
 * Get pet by ID
 */
export const getPetById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const pet = await Pet.findById(id).lean();
    if (!pet) {
      sendError(res, 'Pet not found', undefined, 404);
      return;
    }

    const transformedPet = {
      ...pet,
      id: pet._id.toString(),
      ageDisplay: computeAgeDisplay(pet.age),
      _id: undefined,
      __v: undefined,
    };

    sendSuccess(res, transformedPet, 'Pet retrieved successfully', 200);
  } catch (error) {
    console.error('Get pet by ID error:', error);
    sendError(res, 'Internal server error', undefined, 500);
  }
};

/**
 * Create a new pet (admin only)
 */
export const createPet = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // Validate request body
    const body = createPetSchema.parse(req.body);

    if (!req.user) {
      sendError(res, 'User not authenticated', undefined, 401);
      return;
    }

    // Create pet
    const pet = await Pet.create({
      ...body,
      createdBy: req.user.userId,
      postedDate: new Date(),
    });

    const transformedPet = {
      ...pet.toObject(),
      id: pet._id.toString(),
      ageDisplay: computeAgeDisplay(pet.age),
      _id: undefined,
      __v: undefined,
    };

    sendSuccess(res, transformedPet, 'Pet created successfully', 201);
  } catch (error) {
    if (error instanceof z.ZodError) {
      sendError(res, 'Validation error', JSON.stringify(error.issues), 400);
      return;
    }
    console.error('Create pet error:', error);
    sendError(res, 'Internal server error', undefined, 500);
  }
};

/**
 * Update pet (admin only)
 */
export const updatePet = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const body = updatePetSchema.parse(req.body);

    const pet = await Pet.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    }).lean();

    if (!pet) {
      sendError(res, 'Pet not found', undefined, 404);
      return;
    }

    const transformedPet = {
      ...pet,
      id: pet._id.toString(),
      ageDisplay: computeAgeDisplay(pet.age),
      _id: undefined,
      __v: undefined,
    };

    sendSuccess(res, transformedPet, 'Pet updated successfully', 200);
  } catch (error) {
    if (error instanceof z.ZodError) {
      sendError(res, 'Validation error', JSON.stringify(error.issues), 400);
      return;
    }
    console.error('Update pet error:', error);
    sendError(res, 'Internal server error', undefined, 500);
  }
};

/**
 * Delete pet (admin only)
 */
export const deletePet = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const pet = await Pet.findByIdAndDelete(id);
    if (!pet) {
      sendError(res, 'Pet not found', undefined, 404);
      return;
    }

    sendSuccess(res, null, 'Pet deleted successfully', 200);
  } catch (error) {
    console.error('Delete pet error:', error);
    sendError(res, 'Internal server error', undefined, 500);
  }
};

// Helper function to compute age display
function computeAgeDisplay(months: number): string {
  if (months < 12) {
    return `${months} months`;
  }
  const years = months / 12;
  if (years === Math.floor(years)) {
    return years === 1 ? '1 year' : `${Math.floor(years)} years`;
  }
  return `${years.toFixed(1)} years`;
}

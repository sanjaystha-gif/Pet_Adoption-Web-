import { Request, Response, NextFunction } from 'express';
import { sendSuccess, sendError } from '../utils/response.js';
import { createError } from '../middlewares/errorHandler.js';

// Example controller structure
export const getAllPets = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // TODO: Fetch from database
    const pets = [
      {
        id: '1',
        name: 'Max',
        species: 'dog',
        breed: 'Golden Retriever',
        age: 3,
        gender: 'male',
        description: 'Friendly and energetic dog',
        status: 'available',
      },
    ];

    sendSuccess(res, pets, 'Pets retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const getPetById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    
    // TODO: Fetch from database
    if (!id) {
      throw createError('Pet not found', 404);
    }

    const pet = {
      id,
      name: 'Max',
      species: 'dog',
      breed: 'Golden Retriever',
      age: 3,
      gender: 'male',
      description: 'Friendly and energetic dog',
      status: 'available',
    };

    sendSuccess(res, pet, 'Pet retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const createPet = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const petData = req.body;
    
    // TODO: Save to database
    const newPet = {
      id: Date.now().toString(),
      ...petData,
    };

    sendSuccess(res, newPet, 'Pet created successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const updatePet = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    // TODO: Update in database
    const updatedPet = {
      id,
      ...updates,
    };

    sendSuccess(res, updatedPet, 'Pet updated successfully');
  } catch (error) {
    next(error);
  }
};

export const deletePet = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    
    // TODO: Delete from database
    
    sendSuccess(res, null, 'Pet deleted successfully');
  } catch (error) {
    next(error);
  }
};

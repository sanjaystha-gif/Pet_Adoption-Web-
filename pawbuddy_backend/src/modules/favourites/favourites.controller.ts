import { Response } from 'express';
import { AuthRequest } from '../../middlewares/auth.js';
import { Favourite, Pet } from '../../models/index.js';
import { sendSuccess, sendError, sendPaginated } from '../../utils/response.js';

/**
 * Get user's favourites
 */
export const getFavourites = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      sendError(res, 'User not authenticated', undefined, 401);
      return;
    }

    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const pageSize = Math.min(100, parseInt(req.query.pageSize as string) || 10);
    const skip = (page - 1) * pageSize;

    // Get favourites
    const [favourites, total] = await Promise.all([
      Favourite.find({ userId: req.user.userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(pageSize)
        .lean(),
      Favourite.countDocuments({ userId: req.user.userId }),
    ]);

    // Get pet details for each favourite
    const petIds = favourites.map((f: any) => f.petId);
    const pets = await Pet.find({ _id: { $in: petIds } }).lean();

    const petMap = new Map(pets.map((p: any) => [p._id.toString(), p]));

    // Combine favourites with pet details
    const enrichedFavourites = favourites.map((fav: any) => {
      const pet = petMap.get(fav.petId);
      const transformedPet = pet
        ? {
            ...pet,
            id: pet._id.toString(),
            ageDisplay: computeAgeDisplay(pet.age),
            _id: undefined,
            __v: undefined,
          }
        : null;

      return {
        id: fav._id.toString(),
        userId: fav.userId,
        petId: fav.petId,
        pet: transformedPet,
        createdAt: fav.createdAt.toISOString(),
        updatedAt: fav.updatedAt.toISOString(),
        _id: undefined,
        __v: undefined,
      };
    });

    sendPaginated(
      res,
      enrichedFavourites,
      { page, pageSize, total },
      'Favourites retrieved successfully',
      200
    );
  } catch (error) {
    console.error('Get favourites error:', error);
    sendError(res, 'Internal server error', undefined, 500);
  }
};

/**
 * Add to favourites
 */
export const addFavourite = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      sendError(res, 'User not authenticated', undefined, 401);
      return;
    }

    const { petId } = req.params;

    // Verify pet exists
    const pet = await Pet.findById(petId).lean();
    if (!pet) {
      sendError(res, 'Pet not found', undefined, 404);
      return;
    }

    // Check if already favourited
    const existingFavourite = await Favourite.findOne({
      userId: req.user.userId,
      petId,
    });

    if (existingFavourite) {
      sendError(res, 'Pet is already in your favourites', undefined, 400);
      return;
    }

    // Create favourite
    const favourite = await Favourite.create({
      userId: req.user.userId,
      petId,
    });

    const transformedFavourite = {
      ...favourite.toObject(),
      id: favourite._id.toString(),
      createdAt: favourite.createdAt.toISOString(),
      updatedAt: favourite.updatedAt.toISOString(),
      _id: undefined,
      __v: undefined,
    };

    sendSuccess(res, transformedFavourite, 'Pet added to favourites', 201);
  } catch (error) {
    console.error('Add favourite error:', error);
    sendError(res, 'Internal server error', undefined, 500);
  }
};

/**
 * Remove from favourites
 */
export const removeFavourite = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      sendError(res, 'User not authenticated', undefined, 401);
      return;
    }

    const { petId } = req.params;

    const favourite = await Favourite.findOneAndDelete({
      userId: req.user.userId,
      petId,
    });

    if (!favourite) {
      sendError(res, 'Favourite not found', undefined, 404);
      return;
    }

    sendSuccess(res, null, 'Pet removed from favourites', 200);
  } catch (error) {
    console.error('Remove favourite error:', error);
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

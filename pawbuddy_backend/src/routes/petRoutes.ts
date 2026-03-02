import { Router } from 'express';
import {
  getAllPets,
  getPetById,
  createPet,
  updatePet,
  deletePet,
} from '../controllers/petController.js';
import { validate } from '../middlewares/validate.js';
import { createPetSchema, updatePetSchema, getPetSchema } from '../validators/petValidator.js';
// import { authenticate, authorize } from '../middlewares/auth.js';

const router = Router();

// Public routes
router.get('/', getAllPets);
router.get('/:id', validate(getPetSchema), getPetById);

// Protected routes (uncomment when auth is ready)
// router.use(authenticate); // All routes below require authentication

router.post('/', validate(createPetSchema), createPet);
router.put('/:id', validate(updatePetSchema), updatePet);
router.delete('/:id', deletePet);

export default router;

import { Router } from 'express';
import { authenticate, requireAdmin } from '../../middlewares/auth.js';
import {
  getPets,
  getPetById,
  createPet,
  updatePet,
  deletePet,
} from './pets.controller.js';

const router = Router();

// Public routes
router.get('/', getPets);
router.get('/:id', getPetById);

// Admin routes
router.post('/', authenticate, requireAdmin, createPet);
router.patch('/:id', authenticate, requireAdmin, updatePet);
router.delete('/:id', authenticate, requireAdmin, deletePet);

export default router;

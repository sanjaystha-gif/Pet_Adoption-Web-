import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.js';
import {
  getFavourites,
  addFavourite,
  removeFavourite,
} from './favourites.controller.js';

const router = Router();

// All routes require authentication
router.get('/me', authenticate, getFavourites);
router.post('/:petId', authenticate, addFavourite);
router.delete('/:petId', authenticate, removeFavourite);

export default router;

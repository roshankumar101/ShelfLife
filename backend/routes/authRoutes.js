import { Router } from 'express';
import { login } from '../controllers/authController.js';
import { validateLogin } from '../middleware/validate.js';

const router = Router();

router.post('/login', validateLogin, login);

export default router;

import express from 'express';
import AuthController from '../controllers/authController.js'; // Adjust based on your actual path

const router = express.Router();

router.post('/login', AuthController.login);
router.post('/register', AuthController.register);

export default router; // Using export default instead of module.exports

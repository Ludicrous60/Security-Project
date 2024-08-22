// src/routes/logRoutes.js
import express from 'express';
import { getLogs } from '../controllers/logController.js'; 
import { protect, admin } from '../middleware/authMiddleware.js'; 

const router = express.Router();

router.route('/').get(protect, admin, getLogs);

export default router;

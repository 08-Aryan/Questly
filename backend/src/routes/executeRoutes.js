import express from 'express';
import { protectRoute } from '../middleware/protectRoute.js';
import { executeCode } from '../controllers/executeController.js';

const router = express.Router();

// Protected execution route
router.post('/', protectRoute, executeCode);

export default router;

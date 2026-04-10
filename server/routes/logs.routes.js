import express from 'express';
import { createLog,  obtenerLog} from '../controllers/logs.controller.js';
import verifyToken from '../middleware/jwt.js';

const router = express.Router();
router.post('/', verifyToken, createLog);
router.get('/', verifyToken, obtenerLog);


export default router;
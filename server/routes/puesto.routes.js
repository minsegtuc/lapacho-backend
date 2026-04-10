import express from 'express';
import { createPuesto, obtenerPuestos } from '../controllers/puesto.controller.js';
import verifyToken from '../middleware/jwt.js';

const router = express.Router();
router.post('/', verifyToken, createPuesto);
router.get('/', verifyToken, obtenerPuestos);
export default router;
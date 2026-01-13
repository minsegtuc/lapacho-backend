import express from 'express';
import { createPuesto, obtenerPuestos } from '../controllers/puesto.controller.js';

const router = express.Router();
router.post('/', createPuesto);
router.get('/', obtenerPuestos);
export default router;
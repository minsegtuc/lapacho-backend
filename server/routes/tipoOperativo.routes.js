import express from 'express'
import { createTipoOperativo, getAllOperativos } from '../controllers/tipoOperativo.controller.js'
import verifyToken from '../middleware/jwt.js';

const router = express.Router();
router.post('/', verifyToken, createTipoOperativo)
router.get('/', verifyToken, getAllOperativos)

export default router;
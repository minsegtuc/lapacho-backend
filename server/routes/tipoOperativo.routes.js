import express from 'express'
import { createTipoOperativo, getAllOperativos } from '../controllers/tipoOperativo.controller.js'

const router = express.Router();
router.post('/', createTipoOperativo)
router.get('/', getAllOperativos)

export default router;
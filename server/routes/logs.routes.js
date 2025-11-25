import express from 'express';
import { createLog,  obtenerLog} from '../controllers/logs.controller.js';

const router = express.Router();
router.post('/', createLog);
router.get('/', obtenerLog);


export default router;
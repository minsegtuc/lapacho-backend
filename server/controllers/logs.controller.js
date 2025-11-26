import modelos from '../models/index.model.js'

export const createLog = async (req, res) => {
    try {
        const log = await modelos.Logs.create({
            idLog: req.body.idLog,
            accion: req.body.accion,
            descripcion: req.body.descripcion,
            fecha: req.body.fecha,
            dniId: req.body.dniId,
        });
        res.status(201).json(log);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


export const obtenerLog = async (req, res) => {
    try {
        const logs = await modelos.Logs.findAll();
        res.status(200).json(logs);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los logs', error: error.message })
    }
}
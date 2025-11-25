import modelos from '../models/index.model.js'

export const createLog = async (req, res)=>{
    try {
        const {idLog, accion, userName, userAgent, ip} = req.body;
        const nuevoLog = await modelos.Logs.create({
            idLog, accion, userName, userAgent, ip
        });
        res.status(201).json(nuevoLog);
    } catch (error) {
        res.status(500).json({message: 'Error al crear el log', error: error.message})
    }

}


export const obtenerLog = async (req, res)=>{
    try{
        const logs = await modelos.Logs.findAll();
        res.status(200).json(logs);
    }catch(error){
        res.status(500).json({message: 'Error al obtener los logs', error: error.message})
    }
}
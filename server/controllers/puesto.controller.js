import { registrarLog } from "../helpers/logHelpers.js";
import modelos from "../models/index.model.js"

export const createPuesto = async (req, res) => {
    try {
        const { nombre, coordenadas, tipoPuesto } = req.body;
        console.log(req.body);
        const nuevoPuesto = await modelos.Puesto.create({
            nombre,
            coordenadas,
            tipoPuesto
        })
        
        //await registrarLog('CREAR', `Puesto ${nuevoPuesto.idPuesto} creado`, req.user?.id)
        res.status(201).json(nuevoPuesto)
    } catch (error) {
        res.status(500).json({ message:'Error al crear el puesto', error: error.message })
    }
}

export const obtenerPuestos = async (req, res) =>{
    try {
        const puestos = await modelos.Puesto.findAll({
            order: [['nombre', 'ASC']]
        });
        res.status(200).json(puestos)
    }
    catch (error) {
        res.status(500).json({message: "Error al traer los puestos", error: error.message})
    }
}
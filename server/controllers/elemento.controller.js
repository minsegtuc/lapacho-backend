import { registrarLog } from '../helpers/logHelpers.js';
import modelos from '../models/index.model.js'

export const createElemento = async (req, res)=>{
    try {
        const {descripcion, uMedida} = req.body;
        const nuevoElemento = await modelos.Elemento.create({
            descripcion, uMedida
        });
        await registrarLog('CREAR',`Elemento ${nuevoElemento.idElemento} creado`, req.user?.id);
        res.status(201).json(nuevoElemento);
    } catch (error) {
        res.status(500).json({message: 'Error al crear el elemento', error: error.message})
    }

}

export const updateElemento = async (req, res)=>{
    try {
        const {idElemento} = req.params;
        const {descripcion, uMedida} = req.body;
        const ElementoExistente = await modelos.Elemento.findByPk(idElemento);
        if(!ElementoExistente){
            return res.status(404).json({message: 'Elemento no encontrado'});
        }

        await modelos.Elemento.update({descripcion, uMedida}, {where: {idElemento}});
        await registrarLog('ACTUALIZAR',`Actualización de Elemento ${idElemento}`, req.user?.id);
        res.status(200).json({message: 'Elemento actualizado correctamente'});
    } catch (error) {
        res.status(500).json({message: 'Error al actualizar el Elemento', error: error.message})
    }
}

export const obtenerElemento = async (req, res)=>{
    try{
        const Elemento = await modelos.Elemento.findAll();
        await registrarLog('LEER',`Obtener Elemento ${Elemento}`, req.user?.id);
        res.status(200).json(Elemento);
    }catch(error){
        res.status(500).json({message: 'Error al obtener los Elementos', error: error.message})
    }
}


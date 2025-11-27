import { where } from 'sequelize';
import { registrarLog } from '../helpers/logHelpers.js';
import modelos from '../models/index.model.js'

export const createLapacho = async (req, res) => {
    try {
        const { periodo, elemento, cantidad } = req.body;
        const nuevoLapacho = await modelos.Lapacho.create({
            periodo
        });

        await modelos.Detalle.create({
            cantidad,
            lapachoId: nuevoLapacho.idLapacho,
            elementoId: elemento
        });
        await registrarLog('CREAR',`Lapacho ${nuevoLapacho.idLapacho} creado`, req.user?.id);
        res.status(201).json({ message: 'se creo el nuevo registro' });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear Lapacho', error: error.message })
    }

}

export const updateLapacho = async (req, res) => {
    try {
        const { idLapacho } = req.params;
        const {datosParaActualizar} = req.body;
        const { periodo, elemento, cantidad } = datosParaActualizar;
        console.log(idLapacho, periodo,);
        const lapachoExistente = await modelos.Lapacho.findByPk(idLapacho);
        if (!lapachoExistente) {
            return res.status(404).json({ message: 'Lapacho no encontrado' });
        }
        await modelos.Lapacho.update({ periodo }, { where: { idLapacho } });
        await modelos.Detalle.update({ cantidad, elementoId: elemento }, { where: { lapachoId: idLapacho } });
        await registrarLog('ACTUALIZAR',`Actualización de lapacho ${idLapacho}`, req.user?.id);
        res.status(200).json({ message: 'Lapacho actualizado correctamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar lapacho', error: error.message })
    }
}

export const obtenerLapacho = async (req, res) => {
    try {
        const lapacho = await modelos.Lapacho.findAll();
        await registrarLog('LEER',`Obtener detalle ${lapacho}`, req.user?.id);
        res.status(200).json(lapacho);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener lapacho', error: error.message })
    }
}

export const buscarPeriodoExistente = async (req, res) => {
    console.log("entre a actualizar lapacho")
    try {
        const { periodo, elemento, cantidad } = req.body
        console.log("dato recibido: ", req.body)
        const lapachoExistente = await modelos.Lapacho.findOne({ where: { periodo } })

        console.log("lapachoExistente: ", lapachoExistente)
        if (lapachoExistente) {
            console.log("estoy en el if")
            const detalleExistente = await modelos.Detalle.findOne({ where: { lapachoId: lapachoExistente.idLapacho, elementoId: elemento } })

            console.log("Detalle existente: " , detalleExistente)
            if (!detalleExistente) {
                await modelos.Detalle.create({
                    cantidad,
                    lapachoId: lapachoExistente.idLapacho,
                    elementoId: elemento
                });
                return res.status(201).json({ exist: false, message: 'se creo el nuevo registro' });
            }
            return res.status(200).json({ exists: true, message: 'Ya existe un lapacho para el periodo seleccionado' })
        } else {
            await createLapacho(req, res);
            return res.status(200).json({ exists: false, message: 'No existe un lapacho para el periodo seleccionado' })
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al buscar el periodo', error: error.message })
    }
}

export const obtenerLapachoPorId = async (req, res) => {
    try {
        const { idLapacho, idDetalle } = req.body;
        console.log("Recibi: " , idLapacho, idDetalle)

        if (!idLapacho) {
            return res.status(400).json({ message: 'Debe proporcionar el idLapacho' });
        }

        const lapacho = await modelos.Lapacho.findByPk(idLapacho, {
            include: [
                {
                    model: modelos.Detalle,
                    as: 'detalles',
                    include: [{ model: modelos.Elemento, as: 'elemento' }],
                    where: {
                        idDetalle
                    }
                }
            ]
        });

        if (!lapacho) {
            return res.status(404).json({ message: 'Lapacho no encontrado' });
        }

        res.status(200).json(lapacho);
    }
    catch (error) {
        res.status(500).json({ message: 'Error al obtener lapacho por ID', error: error.message })
    }
}
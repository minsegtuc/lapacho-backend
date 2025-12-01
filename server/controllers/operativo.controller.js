import { where } from 'sequelize';
import { registrarLog } from '../helpers/logHelpers.js';
import modelos from '../models/index.model.js'

export const createOperativo = async (req, res) => {
    try {
        const { periodo, elemento, cantidad } = req.body;
        const nuevoOperativo = await modelos.Operativo.create({
            periodo
        });

        await modelos.Detalle.create({
            cantidad,
            operativoId: nuevoOperativo.idOperativo,
            elementoId: elemento
        });
        await registrarLog('CREAR',`Operativo ${nuevoOperativo.idOperativo} creado`, req.user?.id);
        res.status(201).json({ message: 'se creo el nuevo registro' });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear Operativo', error: error.message })
    }

}

export const updateOperativo = async (req, res) => {
    try {
        const { idOperativo } = req.params;
        const {datosParaActualizar} = req.body;
        const { periodo, elemento, cantidad } = datosParaActualizar;
        console.log(idOperativo, periodo,);
        const operativoExistente = await modelos.Operativo.findByPk(idOperativo);
        if (!operativoExistente) {
            return res.status(404).json({ message: 'Operativo no encontrado' });
        }
        await modelos.Operativo.update({ periodo }, { where: { idOperativo } });
        await modelos.Detalle.update({ cantidad, elementoId: elemento }, { where: { operativoId: idOperativo } });
        await registrarLog('ACTUALIZAR',`Actualización de operativo ${idOperativo}`, req.user?.id);
        res.status(200).json({ message: 'Operativo actualizado correctamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar operativo', error: error.message })
    }
}

export const obtenerOperativo = async (req, res) => {
    try {
        const operativo = await modelos.Operativo.findAll();
        await registrarLog('LEER',`Obtener detalle ${operativo}`, req.user?.id);
        res.status(200).json(operativo);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener operativo', error: error.message })
    }
}

export const buscarPeriodoExistente = async (req, res) => {
    console.log("entre a actualizar operativo")
    try {
        const { tipoOperativo, periodo, elemento, cantidad } = req.body
        console.log("dato recibido: ", req.body)
        const operativoExistente = await modelos.Operativo.findOne({ where: { periodo, tipoOperativo } })

        console.log("operativoExistente: ", operativoExistente)
        if (operativoExistente) {
            console.log("estoy en el if")
            const detalleExistente = await modelos.Detalle.findOne({ where: { operativoId: operativoExistente.idOperativo, elementoId: elemento } })

            console.log("Detalle existente: " , detalleExistente)
            if (!detalleExistente) {
                await modelos.Detalle.create({
                    cantidad,
                    operativoId: operativoExistente.idOperativo,
                    elementoId: elemento
                });
                return res.status(201).json({ exist: false, message: 'se creo el nuevo registro' });
            }
            return res.status(200).json({ exists: true, message: 'Ya existe un operativo para el periodo seleccionado' })
        } else {
            await createOperativo(req, res);
            return res.status(200).json({ exists: false, message: 'No existe un operativo para el periodo seleccionado' })
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al buscar el periodo', error: error.message })
    }
}

export const obtenerOperativoPorId = async (req, res) => {
    try {
        const { idOperativo, idDetalle } = req.body;
        console.log("Recibi: " , idOperativo, idDetalle)

        if (!idOperativo) {
            return res.status(400).json({ message: 'Debe proporcionar el idOperativo' });
        }

        const operativo = await modelos.Operativo.findByPk(idOperativo, {
            include: [
                {
                    model: modelos.Detalle,
                    as: 'detalles',
                    include: [{ model: modelos.Elemento, as: 'elemento' }],
                    where: {
                        idDetalle
                    }
                },
            ]
        });

        if (!operativo) {
            return res.status(404).json({ message: 'Operativo no encontrado' });
        }

        res.status(200).json(operativo);
    }
    catch (error) {
        res.status(500).json({ message: 'Error al obtener operativo por ID', error: error.message })
    }
}
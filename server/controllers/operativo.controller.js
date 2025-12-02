import { Op } from 'sequelize';
import { registrarLog } from '../helpers/logHelpers.js';
import modelos, { sequelize } from '../models/index.model.js'

export const createOperativo = async (req, res) => {
    try {
        const { tipoOperativo, periodo, elemento, cantidad } = req.body;
        const nuevoOperativo = await modelos.Operativo.create({
            periodo,
            tipoOperativoId: tipoOperativo
        });

        await modelos.Detalle.create({
            cantidad,
            operativoId: nuevoOperativo.idOperativo,
            elementoId: elemento
        });
        await registrarLog('CREAR', `Operativo ${nuevoOperativo.idOperativo} creado`, req.user?.id);
        res.status(201).json({ message: 'se creo el nuevo registro' });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear Operativo', error: error.message })
    }

}

export const updateOperativo = async (req, res) => {
    try {
        const { idOperativo } = req.params;
        const { datosParaActualizar } = req.body;
        if (!datosParaActualizar || Object.keys(datosParaActualizar).length === 0) {
            return res.status(400).json({ message: 'Debe enviar los datos a actualizar' });
        }

        const { periodo, elemento, cantidad, idTipoOperativo, tipoOperativo, idDetalle } = datosParaActualizar;

        const operativoExistente = await modelos.Operativo.findByPk(idOperativo);
        if (!operativoExistente) {
            return res.status(404).json({ message: 'Operativo no encontrado' });
        }

        // Aceptar tanto tipoOperativo como idTipoOperativo (compatibilidad con createOperativo)
        const tipoOperativoValue = tipoOperativo ?? idTipoOperativo;
        
        const nuevoPeriodo = periodo ?? operativoExistente.periodo;
        const nuevoTipoOperativo = tipoOperativoValue ?? operativoExistente.tipoOperativoId;

        // Obtener el detalle existente para validar duplicados correctamente
        let detalleExistente = null;
        let nuevoElemento = null;

        // Si se está actualizando elemento, cantidad, periodo o tipoOperativo, necesitamos el detalle
        if (elemento !== undefined || cantidad !== undefined || periodo !== undefined || tipoOperativoValue !== undefined) {
            if (!idDetalle) {
                return res.status(400).json({ message: 'Debe indicar el detalle a actualizar' });
            }

            detalleExistente = await modelos.Detalle.findOne({
                where: { idDetalle, operativoId: idOperativo }
            });

            if (!detalleExistente) {
                return res.status(404).json({ message: 'Detalle no encontrado para el operativo indicado' });
            }

            nuevoElemento = elemento ?? detalleExistente.elementoId;
        }

        // Validar duplicados: no puede existir el mismo elemento en el mismo periodo y tipoOperativo
        // Solo validar si se está cambiando periodo, tipoOperativo o elemento
        let operativoDestino = null;
        if ((periodo !== undefined || tipoOperativoValue !== undefined || elemento !== undefined) && detalleExistente) {
            // Buscar si existe otro operativo con el nuevo periodo y tipoOperativo que tenga el mismo elemento
            const operativoConMismoPeriodoYTipoYElemento = await modelos.Operativo.findOne({
                where: {
                    periodo: nuevoPeriodo,
                    tipoOperativoId: nuevoTipoOperativo,
                    idOperativo: { [Op.ne]: idOperativo }
                },
                include: [{
                    model: modelos.Detalle,
                    as: 'detalles',
                    where: {
                        elementoId: nuevoElemento
                    },
                    required: true
                }]
            });

            if (operativoConMismoPeriodoYTipoYElemento) {
                return res.status(400).json({ 
                    message: 'Ya existe un registro con el mismo elemento para el periodo y tipo operativo seleccionados' 
                });
            }

            // Si se está cambiando periodo o tipoOperativo, verificar si ya existe un operativo con esos valores
            // Si existe, mover el detalle a ese operativo en lugar de actualizar el actual
            if (periodo !== undefined || tipoOperativoValue !== undefined) {
                operativoDestino = await modelos.Operativo.findOne({
                    where: {
                        periodo: nuevoPeriodo,
                        tipoOperativoId: nuevoTipoOperativo,
                        idOperativo: { [Op.ne]: idOperativo }
                    }
                });
            }
        }

        // Validar duplicados dentro del mismo operativo (solo si se cambia el elemento)
        if (elemento !== undefined && detalleExistente && !operativoDestino) {
            const detalleDuplicado = await modelos.Detalle.findOne({
                where: {
                    operativoId: idOperativo,
                    elementoId: nuevoElemento,
                    idDetalle: { [Op.ne]: idDetalle }
                }
            });

            if (detalleDuplicado) {
                return res.status(400).json({ message: 'Ya existe un registro con el mismo elemento para este operativo' });
            }
        }

        const transaccion = await sequelize.transaction();
        try {
            if (operativoDestino) {
                // Si existe un operativo con el nuevo periodo y tipoOperativo, mover el detalle allí
                await detalleExistente.update(
                    {
                        operativoId: operativoDestino.idOperativo,
                        cantidad: cantidad ?? detalleExistente.cantidad,
                        elementoId: elemento ?? detalleExistente.elementoId
                    },
                    { transaction: transaccion }
                );

                // Verificar si el operativo original tiene más detalles, si no, eliminarlo
                const otrosDetalles = await modelos.Detalle.count({
                    where: { operativoId: idOperativo },
                    transaction: transaccion
                });

                if (otrosDetalles === 0) {
                    await operativoExistente.destroy({ transaction: transaccion });
                }
            } else {
                // Actualizar el operativo y detalle normalmente
                if (periodo !== undefined || tipoOperativoValue !== undefined) {
                    await operativoExistente.update(
                        { periodo: nuevoPeriodo, tipoOperativoId: nuevoTipoOperativo },
                        { transaction: transaccion }
                    );
                }

                if (detalleExistente) {
                    await detalleExistente.update(
                        {
                            cantidad: cantidad ?? detalleExistente.cantidad,
                            elementoId: elemento ?? detalleExistente.elementoId
                        },
                        { transaction: transaccion }
                    );
                }
            }

            await transaccion.commit();
        } catch (errorTransaccion) {
            await transaccion.rollback();
            throw errorTransaccion;
        }

        await registrarLog('ACTUALIZAR', `Operativo ${idOperativo} actualizado`, req.user?.id);
        res.status(200).json({ message: 'Operativo actualizado correctamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar operativo', error: error.message })
    }
}

export const obtenerOperativo = async (req, res) => {
    try {
        const operativo = await modelos.Operativo.findAll();
        await registrarLog('LEER', `Obtener detalle ${operativo}`, req.user?.id);
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
        const operativoExistente = await modelos.Operativo.findOne({ where: { periodo, tipoOperativoId: tipoOperativo } })

        console.log("operativoExistente: ", operativoExistente)
        if (operativoExistente) {
            console.log("estoy en el if")
            const detalleExistente = await modelos.Detalle.findOne({ where: { operativoId: operativoExistente.idOperativo, elementoId: elemento } })

            console.log("Detalle existente: ", detalleExistente)
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
            //return res.status(200).json({ exists: false, message: 'No existe un operativo para el periodo seleccionado' })
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al buscar el periodo', error: error.message })
    }
}

export const obtenerOperativoPorId = async (req, res) => {
    try {
        const { idOperativo, idDetalle } = req.body;
        console.log("Recibi: ", idOperativo, idDetalle)

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
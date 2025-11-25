import { QueryTypes } from 'sequelize';
import { registrarLog } from '../helpers/logHelpers.js';
import modelos, { sequelize } from '../models/index.model.js'

const normalizeFechaInicio = (valor) => {
    if (!valor) return null;
    if (/^\d{4}$/.test(valor)) return `${valor}-01-01`;
    if (/^\d{4}-\d{2}$/.test(valor)) return `${valor}-01`;
    if (/^\d{4}-\d{2}-\d{2}$/.test(valor)) return valor;
    return null;
};

const normalizeFechaFin = (valor) => {
    if (!valor) return null;
    if (/^\d{4}$/.test(valor)) return `${valor}-12-31`;
    if (/^\d{4}-\d{2}$/.test(valor)) {
        const [anio, mes] = valor.split('-').map(Number);
        const lastDay = new Date(anio, mes, 0).getDate();
        return `${valor}-${String(lastDay).padStart(2, '0')}`;
    }
    if (/^\d{4}-\d{2}-\d{2}$/.test(valor)) return valor;
    return null;
};

export const createDetalle = async (req, res) => {
    try {
        const { cantidad, lapachoId, elementoId } = req.body;
        const nuevoDetalle = await modelos.Detalle.create({
            cantidad, lapachoId, elementoId
        });
        //await registrarLog('CREAR',`Detalle ${idDetalle} creado`, req.user.idDetalle, req.user.name, req.user.ip, req.user.userAgent);
        res.status(201).json(nuevoDetalle);
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el detalle', error: error.message })
    }
}

export const updateDetalle = async (req, res) => {
    try {
        const { idDetalle } = req.params;
        const { cantidad, lapachoId, elementoId } = req.body;
        const detalleExistente = await modelos.Detalle.findByPk(idDetalle);
        if (!detalleExistente) {
            return res.status(404).json({ message: 'Detalle no encontrado' });
        }

        await modelos.Detalle.update({ cantidad, lapachoId, elementoId }, { where: { idDetalle } });
        //await registrarLog('ACTUALIZAR',`Actualización de detalle ${idDetalle}`, req.user.idDetalle, req.user.name, req.user.ip, req.user.userAgent);
        res.status(200).json({ message: 'Detalle actualizado correctamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el detalle', error: error.message })
    }
}

export const obtenerDetalle = async (req, res) => {
    try {
        const detalle = await modelos.Detalle.findAll({
            include:[
                { model: modelos.Lapacho, as: 'lapacho' },
                { model: modelos.Elemento, as: 'elemento' }
            ]
        });
        //console.log("detalle: " , detalle)
        //await registrarLog('LEER',`Obtener detalle ${detalle}`, req.user.idDetalle, req.user.name, req.user.ip, req.user.userAgent);
        res.status(200).json({detalle});
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los detalles', error: error.message })
    }
}

export const obtenerDetalleAcumulado = async (req, res) => {
    const { fechaDesde, fechaHasta } = req.body;
    try {
        const fechaInicioNormalizada = normalizeFechaInicio(fechaDesde);
        const fechaFinNormalizada = normalizeFechaFin(fechaHasta);

        if ((fechaDesde && !fechaInicioNormalizada) || (fechaHasta && !fechaFinNormalizada)) {
            return res.status(400).json({ message: 'Formato de fecha inválido. Use YYYY, YYYY-MM o YYYY-MM-DD.' });
        }

        const whereParts = [];
        const replacements = {};

        if (fechaInicioNormalizada) {
            whereParts.push('l.periodo >= :fechaDesde');
            replacements.fechaDesde = fechaInicioNormalizada;
        }

        if (fechaFinNormalizada) {
            whereParts.push('l.periodo <= :fechaHasta');
            replacements.fechaHasta = fechaFinNormalizada;
        }

        const whereClause = whereParts.length ? `WHERE ${whereParts.join(' AND ')}` : '';

        const query = `
            SELECT 
                e."idElemento",
                e.descripcion,
                e."uMedida",
                COALESCE(SUM(d.cantidad), 0) AS cantidadTotal
            FROM detalle d
            INNER JOIN elemento e ON e."idElemento" = d."elementoId"
            LEFT JOIN lapacho l ON l."idLapacho" = d."lapachoId"
            ${whereClause}
            GROUP BY e."idElemento", e.descripcion, e."uMedida"
            ORDER BY e.descripcion ASC
        `;

        const detalleAcumulado = await sequelize.query(query, {
            replacements,
            type: QueryTypes.SELECT
        });

        res.status(200).json(detalleAcumulado);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los detalles acumulados', error: error.message })
    }
}
import modelos from "../models/index.model.js";

export const createTipoOperativo = async (req, res) => {
    try {
        const tipoOperativo = await modelos.tipoOperativo.create({
            idTipoOperativo: req.body.idTipoOperativo,
            descripcion: req.body.descripcion
        })

        req.status(201).json(tipoOperativo)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const getAllOperativos = async (req, res) => {
    try {
        const tipoOperativos = await modelos.tipoOperativo.findAll();
        res.status(200).json(tipoOperativos)
    } catch (error) {
        res.status(500).json({message: "Error al traer los operativos", error: error.message})
    }
}


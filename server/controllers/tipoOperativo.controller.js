import modelos from "../models/index.model";

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


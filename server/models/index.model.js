import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import operativoModel from "./operativo.model.js";
import detalleModel from "./detalle.model.js";
import logsModel from "./logs.model.js";
import elementoModel from "./elemento.model.js";
import tipoOperativoModel from "./tipoOperativo.model.js";
import puestoModel from "./puesto.model.js";

const modelos = {
    Operativo: operativoModel(sequelize, DataTypes),
    Detalle: detalleModel(sequelize, DataTypes),
    Logs: logsModel(sequelize, DataTypes),
    Elemento: elementoModel(sequelize, DataTypes),
    tipoOperativo: tipoOperativoModel(sequelize, DataTypes),
    Puesto: puestoModel(sequelize, DataTypes),
}
Object.values(modelos).forEach((modelo)=>{
    if(typeof modelo.associate === 'function'){
        modelo.associate(modelos);
    }
})

export {sequelize};
export default modelos;
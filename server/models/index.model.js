import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import lapachoModel from "./lapacho.model.js";
import detalleModel from "./detalle.model.js";
import logsModel from "./logs.model.js";
import elementoModel from "./elemento.model.js";

const modelos = {
    Lapacho: lapachoModel(sequelize, DataTypes),
    Detalle: detalleModel(sequelize, DataTypes),
    Logs: logsModel(sequelize, DataTypes),
    Elemento: elementoModel(sequelize, DataTypes)    
}
Object.values(modelos).forEach((modelo)=>{
    if(typeof modelo.associate === 'function'){
        modelo.associate(modelos);
    }
})

export {sequelize};
export default modelos;